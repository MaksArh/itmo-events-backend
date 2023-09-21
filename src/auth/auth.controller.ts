import { Controller, Get, Query, Res } from '@nestjs/common';
import { SsoService } from './sso.service';
import { AuthService } from './auth.service';
import { FastifyReply } from 'fastify';
import { ApiTags } from '@nestjs/swagger';
import { isString } from '@nestjs/common/utils/shared.utils';
import { LoggerService } from 'logger/logger.service';

@ApiTags('Логин')
@Controller('login')
export class AuthController {
    constructor (private readonly ssoService: SsoService,
        private readonly authService: AuthService,
        private readonly console: LoggerService) {}

    @Get()
    async login (@Query() query: any, @Res() res: FastifyReply): Promise<any> {
        try {
            const code = query.code as string;
            await this.console.log(['[CODE]:', code]);
            await this.console.log(['[RESPONSE]:', res]);
            if (code === undefined) {
                await this.console.log(['[RED-AUTH]:']);
                const authorizationUrl = this.ssoService.getAuthorizationUrl();
                void await res.status(307).redirect(authorizationUrl);
            } else {
                const tokenData = await this.ssoService.exchangeCodeForAccessToken(code);
                await this.console.log(['[TOKENDATA]:', tokenData]);
                if (isString(tokenData.error)) {
                    return await res.status(301).redirect('/error');
                }
                if (tokenData?.id_token) {
                    await this.console.log(['[IMPORTING+COOKIE]:']);
                    await this.authService.importUser(tokenData?.id_token);
                    const cookies = [
                        ['access_token', tokenData.access_token, tokenData.expires_in],
                        ['id_token', tokenData.id_token],
                        ['refresh_token', tokenData.refresh_token, tokenData.refresh_expires_in],
                        ['token_type', tokenData.token_type],
                        ['session_state', tokenData.session_state],
                        ['scope', tokenData.scope]
                    ];
                    cookies.forEach(cookieConfig => {
                        const [name, value, maxAge] = cookieConfig;
                        await res.setCookie(name, `${value}`, {
                            httpOnly: true,
                            ...(maxAge !== undefined && { maxAge }),
                            sameSite: 'strict',
                            path: '/'
                        });
                    });
                    // await this.authService.setCookies(res, tokenData);
                } else {
                    return await res.status(301).redirect('/error');
                }
                await this.console.log(['[BEFORE REDIRECT]:']);
                void await res.status(301).redirect('/');
                await this.console.log(['[AFTER REDIRECT]:']);
            }
        } catch (e) {
            console.error('══[ERR] auth controller handleCallback:', e.message);
            await this.console.log(['══[ERR] auth controller handleCallback:', e as string]);
            await res.status(307).redirect('/');
        }
    }

    @Get('out')
    logout (@Res() res: FastifyReply): void {
        try {
            const logoutUrl = this.ssoService.getLogoutUrl();
            void res.redirect(307, logoutUrl);
        } catch (e) {
            console.log(`══[ERR] auth controller logout controller: ${e.message as string}`);
        }
    }
}
