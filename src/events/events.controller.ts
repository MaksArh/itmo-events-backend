import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from 'events/dto/create-event.dto';
import { EventsService } from 'events/events.service';
import { Cookies } from 'decorators/cookie.decorator';
import { Event } from 'events/event.model';
import { UsersService } from 'users/users.service';

@ApiTags('Мероприятия')
@Controller('events')
export class EventsController {
    constructor (private readonly eventsService: EventsService, private readonly userService: UsersService) {}

    @ApiOperation({ summary: 'Получение всех мероприятий' })
    @ApiResponse({ status: 200, type: Event })
    @Get('fetch')
    async fetchEvents (): Promise<Event[]> {
        return await this.eventsService.fetchEvents();
    }

    @ApiBody({ type: CreateEventDto, description: 'authorId сам подтягивается системой, передавать не надо' })
    @ApiOperation({ summary: 'Создание мероприятия' })
    @ApiResponse({ status: 200, type: Event })
    @Post('create')
    async createEvent (@Body() data: Omit<CreateEventDto, 'authorId'>, @Cookies('id_token') idToken: string):
    Promise<CreateEventDto | any> {
        try {
            const isu = (this.userService.decodeUser(idToken)).isu;
            const eventDto: CreateEventDto = { ...data, authorId: isu };
            const event = await this.eventsService.createEvent(eventDto);
            return { id: event?.id };
        } catch (e) {
            console.log(`[LOG] createForm: ${e.message as string}`);
            return { null: undefined };
        }
    }

    @ApiOperation({ summary: 'Получение мероприятия по id' })
    @ApiResponse({ status: 200, type: Event })
    @Get(':id')
    async getEvent (@Param() params): Promise<Event | null> {
        return await this.eventsService.getEvent(params.isu);
    }
}
