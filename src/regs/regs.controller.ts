import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegsService } from 'regs/regs.service';

@ApiTags('Заявки')
@Controller('regs')
export class RegsController {
    constructor (private readonly regService: RegsService) {}
    @Get('get')
    async getAll () {
        return await this.regService.getAll();
    }
}
