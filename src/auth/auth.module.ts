import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SsoService } from './sso.service';
import { AuthService } from './auth.service';
import { UsersModule } from 'users/users.module';

@Module({
    controllers: [AuthController],
    providers: [SsoService, AuthService],
    imports: [
        forwardRef(() => UsersModule)
    ],
    exports: [
        SsoService,
        AuthService
    ]
})
export class AuthModule {}
