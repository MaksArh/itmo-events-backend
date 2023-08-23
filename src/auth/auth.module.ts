import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SsoService } from './sso.service';
import { AuthService } from './auth.service';
import { UsersModule } from 'users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service } from 'auth/service.model';

@Module({
    controllers: [AuthController],
    providers: [SsoService, AuthService],
    imports: [
        forwardRef(() => UsersModule),
        SequelizeModule.forFeature([Service])
    ],
    exports: [
        SsoService,
        AuthService
    ]
})
export class AuthModule {
}
