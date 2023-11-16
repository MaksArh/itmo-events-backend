import { type ExecutionContext, Injectable, type CanActivate } from '@nestjs/common';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { AuthService } from 'auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor (private readonly authService: AuthService) {}

    async canActivate (context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<FastifyRequest>();
        const res = context.switchToHttp().getResponse<FastifyReply>();

        try {
            const bearer = req.cookies.token_type;
            const accessToken = req.cookies.access_token;
            if (accessToken !== undefined && bearer === 'Bearer' &&
                await this.authService.validateToken(accessToken)) {
                return true;
            } else if (req.cookies.refresh_token !== undefined) {
                const newTokens = await this.authService.updateTokensFromRefresh(req.cookies.refresh_token);
                await this.authService.setCookies(res, newTokens);
                return true;
            }
            return false;
        } catch (e) {
            console.log(`[ERR] JwtGuard: ${e.message as string}`);
            return false;
        }
    }
}
