import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Мероприятия')
@Controller('events')
export class EventsController {
    @Get()
    fetchEvents (): object[] {
        return [{ id: 123 }];
    }
}
