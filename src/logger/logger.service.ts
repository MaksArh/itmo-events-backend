import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from 'logger/logger.model';
import { type CreateLogDto } from 'logger/dto/create-log.dto';

@Injectable()
export class LoggerService {
    constructor (@InjectModel(Logger) private readonly loggerRepository: typeof Logger) {
    }

    async log (dto: CreateLogDto): Promise<void> {
        try {
            await this.loggerRepository.create(dto);
        } catch (e) {
            console.log(e.message);
        }
    }

    async getLogs (): Promise<Logger[]> {
        return await this.loggerRepository.findAll({ attributes: { exclude: ['id'] } });
    }

    async deleteLogs (): Promise<void> {
        await this.loggerRepository.truncate();
    }
}
