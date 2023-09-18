import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { SsoService } from './sso.service';
import { AuthService } from './auth.service';
import { FastifyReply } from 'fastify';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Логин')
@Controller('login')
export class AuthController {
    constructor (private readonly ssoService: SsoService, private readonly authService: AuthService) {}

    // @Get('login')
    // async redirectToAuthorization (@Res() res: FastifyReply): Promise<any> {
    //     try {
    //         const authorizationUrl = this.ssoService.getAuthorizationUrl();
    //         await res.redirect(307, authorizationUrl);
    //     } catch (e) {
    //         console.log(`[ERR] auth controller login: ${e.message as string}`);
    //     }
    // }

    @Get()
    async login (@Query() query: any, @Res() res: FastifyReply): Promise<void> {
        try {
            const code = query.code as string;
            if (code === undefined) {
                console.log('YESS');
                const authorizationUrl = this.ssoService.getAuthorizationUrl();
                void await res.redirect(307, authorizationUrl);
                return;
            }
            console.log('CODED');
            console.log('[QUERY]:', query.code);
            const tokenData = await this.ssoService.exchangeCodeForAccessToken(code);
            await this.authService.importUser(tokenData.id_token);
            this.authService.setCookies(res, tokenData);
            console.log('TOKENED');
            void await res.redirect(307, '/');
        } catch (e) {
            console.error('[ERR] auth controller handleCallback:', e.message);
            void res.redirect(307, '/');
        }
    }

    @Get('out')
    logout (@Res() res: FastifyReply): void {
        try {
            const logoutUrl = this.ssoService.getLogoutUrl();
            void res.redirect(301, logoutUrl);
        } catch (e) {
            console.log(`[ERR] auth controller logout controller: ${e.message as string}`);
        }
    }
}
