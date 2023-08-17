import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Новости')
@Controller('news')
export class NewsController {
    @Get()
    fetchNews (): object[] {
        return [{ id: 123 }];
    }
}
