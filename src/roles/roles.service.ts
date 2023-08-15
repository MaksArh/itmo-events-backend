import { Injectable } from '@nestjs/common';
import { type createRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './role.model';

@Injectable()
export class RolesService {
    constructor (@InjectModel(Role) private readonly roleRepository: typeof Role) {
    }

    async createRole (dto: createRoleDto): Promise<Role | null> {
        try {
            return await this.roleRepository.create(dto);
        } catch (e) {
            console.log(`createRole service ERR: ${e.message as string}`);
            return null;
        }
    }

    async getRoleByValue (value: string): Promise<Role | null> {
        try {
            // role from RoleRepository
            return await this.roleRepository.findOne({ where: { value } });
        } catch (e) {
            console.log(`getRoleByValue service ERR: ${e.message as string}`);
            return null;
        }
    }
}
