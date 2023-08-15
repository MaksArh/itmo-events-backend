import { Controller, Get, Query, Res } from '@nestjs/common';
import { SsoService } from './sso.service';
import { AuthService } from './auth.service';
import { FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
    constructor (private readonly ssoService: SsoService, private readonly authService: AuthService) {}

    @Get('/login')
    redirectToAuthorization (@Res() res: FastifyReply): void {
        try {
            const authorizationUrl = this.ssoService.getAuthorizationUrl();
            void res.redirect(301, authorizationUrl);
        } catch (e) {
            console.log(`login controller ERR: ${e.message as string}`);
        }
    }

    @Get('/callback')
    async handleCallback (@Query() query, @Res() res: FastifyReply): Promise<void> {
        try {
            const code = query.code as string;
            const tokenData = await this.ssoService.exchangeCodeForAccessToken(code);
            await this.authService.importUser(tokenData.id_token);
            this.authService.setCookies(res, tokenData);
            await res.redirect(301, 'http://localhost:8080/app/home');
        } catch (e) {
            console.error('Ошибка при обмене кода авторизации на Access Token:', e.message);
            void res.redirect(500, '/login');
        }
    }

    @Get('/logout')
    logout (@Res() res: FastifyReply): void {
        void this.ssoService.getLogoutLink().then(logoutLink => {
            if (logoutLink != null) {
                void res.redirect(301, logoutLink);
            } else {
                console.error('Ошибка при получении ссылки на выход из системы SSO');
                void res.redirect(500, '/');
            }
        });
    }
}
