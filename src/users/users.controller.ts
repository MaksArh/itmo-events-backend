import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.model';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { Cookies } from 'decorators/cookie.decorator';

@ApiTags('Пользователи')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor (private readonly usersService: UsersService) { }

    @ApiOperation({ summary: 'Получение пользователя' })
    @ApiResponse({ status: 200, type: [User] })
    @Get('/me')
    async getMe (@Cookies('id_token') idToken: string): Promise<User | null> {
        try {
            const user = this.usersService.decodeUser(idToken);
            return await this.usersService.getUser(user.isu);
        } catch (e) {
            console.log(`getMe controller ERR: ${e.message as string}`);
            return null;
        }
    }

    @ApiOperation({ summary: 'Получение пользователя по isu' })
    @ApiResponse({ status: 200, type: [User] })
    @Get('/:isu')
    async getUser (@Param() params): Promise<User | null> {
        return await this.usersService.getUser(params.isu);
    }
}
