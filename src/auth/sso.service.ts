import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { URLSearchParams } from 'url';
import * as process from 'process';

@Injectable()
export class SsoService {
    private readonly itmoIdAuthUrl = process.env.ITMOIDURL_AUTH ?? 'NULL_AUTH';
    private readonly itmoIdTokenUrl = process.env.ITMOIDURL_TOKEN ?? 'NULL_AUTH';
    private readonly itmoIdUserinfoUrl = process.env.ITMOIDURL_USERINFO ?? 'NULL_AUTH';
    private readonly itmoIdLogoutUrl = process.env.ITMOIDURL_LOGOUT ?? 'NULL_AUTH';
    private readonly itmoIdPublicUrl = process.env.ITMOIDURL_PUBLIC ?? 'NULL_AUTH';
    private readonly clientId = process.env.CLIENT_ID ?? 'NULL_AUTH';
    private readonly clientSecret = process.env.CLIENT_SECRET ?? 'NULL_AUTH';
    private readonly redirectUri = process.env.REDIRECT_URI ?? 'NULL_AUTH';
    private readonly logoutUri = process.env.LOGOUT_URI ?? 'NULL_AUTH';

    getAuthorizationUrl (): string {
        const scope = 'openid profile edu work';
        return `${this.itmoIdAuthUrl}?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}&scope=${scope}`;
    }

    async refreshAccess (refreshToken: string): Promise<any> {
        try {
            const data = new URLSearchParams();
            data.append('client_id', this.clientId);
            data.append('client_secret', this.clientSecret);
            data.append('grant_type', 'refresh_token');
            data.append('refresh_token', refreshToken);
            const response = await axios.post(this.itmoIdTokenUrl, data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return response.data;
        } catch (e) {
            console.log(`refreshAccess sso ERR: ${e.message as string}`);
        }
    }

    async exchangeCodeForAccessToken (code: string): Promise<Record<string, any>> {
        try {
            const data = new URLSearchParams();
            data.append('client_id', this.clientId);
            data.append('client_secret', this.clientSecret);
            data.append('grant_type', 'authorization_code');
            data.append('redirect_uri', this.redirectUri);
            data.append('code', code);
            const response = await axios.post(this.itmoIdTokenUrl, data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return response.data;
        } catch (e) {
            console.log(`exchangeCodeForAccessToken service ERR: ${e.message as string}`);
            return { null: 'null' };
        }
    }

    async getPublicKeys (): Promise<any> {
        try {
            const keys = await axios.get(this.itmoIdPublicUrl);
            return keys.data.keys;
        } catch (e) {
            console.log(`getPulicKeys service ERR: ${e.message as string}`);
            return { null: 'null' };
        }
    }

    async getProfileFromToken (accessToken: string): Promise<Record<string, any>> {
        try {
            const user = await axios.get(this.itmoIdUserinfoUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
            return user.data;
        } catch (e) {
            console.log(`getProfileFromToken service ERR: ${e.message as string}`);
            return { null: 'null' };
        }
    }

    async getLogoutLink (): Promise<string | null> {
        try {
            return `${this.itmoIdLogoutUrl}?client_id=${this.clientId}&post_logout_redirect_uri=${this.logoutUri}`;
        } catch (e) {
            console.log(`logout service ERR: ${e.message as string}`);
            return null;
        }
    }
}
