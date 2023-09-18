import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Form } from 'forms/form.model';
import { type CreateFormDto } from 'forms/dto/create-form.dto';

@Injectable()
export class FormsService {
    constructor (@InjectModel(Form) private readonly formRepository: typeof Form) {
    }

    async createForm (dto: CreateFormDto): Promise<Form> {
        return await this.formRepository.create(dto);
    }

    async getFormById (id: number): Promise<Form | null> {
        return await this.formRepository.findOne({ where: { id } });
    }

    async deleteForm (id: number): Promise<void> {
        await this.formRepository.destroy({ where: { id } });
    }
}
