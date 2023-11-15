import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.model';
import { Cookies } from 'decorators/cookie.decorator';
import { Roles } from 'decorators/roles.decorator';
import { RoleGuard } from 'auth/role.guard';
import { type UserRO } from 'users/users.interface';
import { AddRoleDto } from 'users/dto/add-role.dto';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService) { }

    @ApiOperation({ summary: 'Получение пользователя' })
    @ApiResponse({ status: 200, type: User })
    @Roles('USER')
    @Get('me')
    async getMe (@Cookies('id_token') idToken: string): Promise<UserRO> {
        const isu = (this.usersService.decodeUser(idToken).isu);
        return await this.usersService.getUser(isu);
    }

    @Roles('ADMIN')
    @Post('/role')
    async addRole (@Body() dto: AddRoleDto): Promise<AddRoleDto> {
        return await this.usersService.addRole(dto);
    }

    @ApiOperation({ summary: 'Получение пользователя по isu' })
    @ApiResponse({ status: 200, type: User })
    @Roles('ADMIN')
    @Get(':isu')
    async getUser (@Param() params): Promise<UserRO> {
        return await this.usersService.getUser(params.isu);
    }

    @ApiOperation({ summary: 'Обновление данных пользователя' })
    @ApiResponse({ status: 200, type: User })
    @Roles('USER')
    @UseGuards(RoleGuard)
    @Put('update')
    async updateUser (@Body() updates: User, @Cookies('id_token') idToken: string): Promise<UserRO> {
        const isu = (this.usersService.decodeUser(idToken).isu);
        return await this.usersService.updateUser(isu, updates);
    }
}
