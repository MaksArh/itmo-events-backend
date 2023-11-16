import {forwardRef, Module} from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './role.model';
import { User } from 'users/user.model';
import { UserRoles } from './user-roles.model';
import { RolesInitializationService } from 'roles/roles-initialization.service';
import {UsersModule} from "users/users.module";
import {AuthModule} from "auth/auth.module";

@Module({
    providers: [RolesService, RolesInitializationService],
    controllers: [RolesController],
    imports: [
        SequelizeModule.forFeature([Role, User, UserRoles]),
        forwardRef(() => UsersModule),
        forwardRef(() => AuthModule)
    ],
    exports: [
        RolesService
    ]
})
export class RolesModule {}
