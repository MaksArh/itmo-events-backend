import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { type CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'roles/roles.service';
import * as jwt from 'jsonwebtoken';
import { type UserData, type UserRO } from 'users/users.interface';
import { type AddRoleDto } from 'users/dto/add-role.dto';
import { Sequelize } from 'sequelize';

@Injectable()
export class UsersService {
    constructor (@InjectModel(User) private readonly userRepository: typeof User, private readonly roleService: RolesService) {
    }

    async createUser (dto: CreateUserDto): Promise<UserRO | null> {
        const candidate = await this.userRepository.findByPk(dto.isu);
        if (candidate !== null) {
            return null;
        }
        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue('USER');
        if (role != null) {
            await user.$set('roles', [role.id]);
        } else {
            throw new NotFoundException('Role not found');
        }
        return { user };
    }

    decodeUser (idToken: string): UserData {
        return jwt.decode(idToken) as UserData;
    }

    async updateUser (isu: number, updates: object): Promise<UserRO> {
        const user = await this.userRepository.findOne({ where: { isu } });
        if (user == null) {
            throw new NotFoundException('User not found');
        }
        try {
            await user.update(updates);
            return { user };
        } catch (error) {
            throw new InternalServerErrorException('Failed to update user');
        }
    }

    async addRole (dto: AddRoleDto): Promise<AddRoleDto> {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);
        if ((role != null) && (user != null)) {
            await user.$add('role', role.id);
            return dto;
        }
        throw new HttpException('User or Role not found', HttpStatus.NOT_FOUND);
    }

    async getUser (isu: number): Promise<UserRO> {
        const user = await this.userRepository.findOne({
            where: { isu },
            attributes: {
                include: [
                    [Sequelize.literal('(SELECT array_agg("value") FROM "roles" INNER JOIN "user_roles" ON "roles"."id" = "user_roles"."roleId" WHERE "user_roles"."userId" = "User"."isu")'), 'roles']
                ]
            }
        });
        if (user === null) {
            throw new NotFoundException('User not found');
        }
        const userData: UserData = {
            ...user.dataValues,
            roles: user.dataValues.roles
        };
        return { user: userData };
    }
}
