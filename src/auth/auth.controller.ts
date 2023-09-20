import { Controller, Get, Query, Res } from '@nestjs/common';
import { SsoService } from './sso.service';
import { AuthService } from './auth.service';
import { FastifyReply } from 'fastify';
import { ApiTags } from '@nestjs/swagger';
import { LoggerService } from 'logger/logger.service';

@ApiTags('Логин')
@Controller('login')
export class AuthController {
    constructor (private readonly ssoService: SsoService,
        private readonly authService: AuthService,
        private readonly logger: LoggerService) {}

    @Get()
    async login (@Query() query: any, @Res() res: FastifyReply): Promise<void> {
        try {
            const code = query.code as string;
            if (code === undefined) {
                console.log('══[NO CODE]: ', code); //
                await this.logger.log({ log: ['══[NO CODE]:', code] }); //
                const authorizationUrl = this.ssoService.getAuthorizationUrl();
                void await res.status(307).redirect(authorizationUrl);
            } else {
                console.log('══[CODE SUCCESS]: ', code); //
                await this.logger.log({ log: ['══[CODE SUCCESS]: ', code] });//
                const tokenData = await this.ssoService.exchangeCodeForAccessToken(code);
                console.log('══[TOKEN_DATA]: ', tokenData); //
                await this.logger.log({ log: ['══[TOKEN_DATA]: ', tokenData] });//
                await this.authService.importUser(tokenData.id_token);
                await this.authService.setCookies(res, tokenData);
                await this.logger.log({ log: ['══[AFTER REDIRECT]'] }); //
                console.log('══[AFTER REDIRECT]'); //
                return await res.status(307).redirect('/');
            }
        } catch (e) {
            console.error('══[ERR] auth controller handleCallback:', e.message);
            await this.logger.log({ log: ['══[ERR] auth controller handleCallback:', e.message] });//
            void res.status(307).redirect('/');
        }
    }

    @Get('out')
    logout (@Res() res: FastifyReply): void {
        try {
            const logoutUrl = this.ssoService.getLogoutUrl();
            void res.redirect(301, logoutUrl);
        } catch (e) {
            console.log(`══[ERR] auth controller logout controller: ${e.message as string}`);
        }
    }
}
