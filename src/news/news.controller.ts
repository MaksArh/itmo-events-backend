import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Новости')
@Controller('news')
export class NewsController {
    @Get('fetch')
    fetchNews (): object[] {
        return [{ id: 123 }];
    }
}
