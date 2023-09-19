import { type ExecutionContext, Injectable, type CanActivate } from '@nestjs/common';
import { type FastifyRequest } from 'fastify';
import { AuthService } from 'auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor (private readonly authService: AuthService) {}

    async canActivate (context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<FastifyRequest>();
        // const res = context.switchToHttp().getResponse<FastifyReply>();
        console.log('╔═════════╡start guard╞════════╗');
        try {
            const bearer = req.cookies.token_type;
            const accessToken = req.cookies.access_token;
            if (accessToken !== undefined && bearer === 'Bearer' &&
                await this.authService.validateToken(accessToken)) {
                console.log('╠═login access:: successful    ║\n╚═════════╡ end guard ╞════════╝');
                return true;
            } else {
                if (req.cookies.refresh_token !== undefined) {
                    // const newTokens = await this.authService.updateTokensFromRefresh(req.cookies.refresh_token);
                    // this.authService.setCookies(res, newTokens);
                    // console.log('╠═login refresh:: successful   ║\n╚═════════╡ end guard ╞════════╝');
                    // void res.status(307).redirect(req.headers.referer as string);
                    return true;
                }
                console.log('╠═login:: denied no access     ║\n╚═════════╡ end guard ╞════════╝');
                // void res.status(307).redirect('/back/auth/login');
                return false;
            }
        } catch (e) {
            console.log(`╠═[ERR] JwtGuard: ${e.message as string}`);
            console.log('╚═════════╡ end guard ╞════════╝');
            // void res.status(307).redirect('/back/auth/login');
            return false;
        }
    }
}
