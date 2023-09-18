import { Injectable } from '@nestjs/common';
import { Reg } from 'regs/reg.model';
import { type CreateRegDto } from 'regs/dto/create-reg.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RegsService {
    constructor (@InjectModel(Reg) private readonly regRepository: typeof Reg) {}

    async getAll (): Promise<Reg[]> {
        return await this.regRepository.findAll();
    }

    async createReg (dto: CreateRegDto): Promise<void> {
        await this.regRepository.create(dto);
    }

    async deleteReg (id: number): Promise<void> {
        await this.regRepository.destroy({ where: { id } });
    }
}
