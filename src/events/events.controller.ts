import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from 'events/dto/create-event.dto';
import { EventsService } from 'events/events.service';
import { Cookies } from 'decorators/cookie.decorator';
import { Event } from 'events/event.model';
import { UsersService } from 'users/users.service';
import { RegsService } from 'regs/regs.service';
import { FormsService } from 'forms/forms.service';
import { Roles } from 'decorators/roles.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { RoleGuard } from 'auth/role.guard';

@ApiTags('Мероприятия')
@UseGuards(JwtAuthGuard)
@UseGuards(RoleGuard)
@Controller('events')
export class EventsController {
    constructor (
        private readonly eventsService: EventsService,
        private readonly userService: UsersService,
        private readonly regService: RegsService,
        private readonly formsService: FormsService) {}

    @ApiOperation({ summary: 'Получение всех мероприятий' })
    @ApiResponse({ status: 200, type: Event })
    @Roles('USER')
    @Get('fetch')
    async fetchEvents (): Promise<Event[]> {
        /*
        сделать возвращение 3 разных массивов учитывая роли пользователя,
        массив всех мероприятий ( только на которые он может зарегистрироваться),
        массив мероприятий на которые он зарегистрировался ( не админит)
        массив мероприятий которые он администрирует ( если администрирует)

        все эти 3 массива не должны пересекаться
        */
        return await this.eventsService.fetchEvents();
    }

    @ApiBody({ type: CreateEventDto, description: 'authorId сам подтягивается системой, передавать не надо' })
    @ApiOperation({ summary: 'Создание мероприятия' })
    @ApiResponse({ status: 200, type: Event })
    @Roles('EVENTADMIN')
    @Post('create')
    async createEvent (@Body() data: Omit<CreateEventDto, 'userId'>, @Cookies('id_token') idToken: string):
    Promise<CreateEventDto | any> {
        try {
            const isu = (this.userService.decodeUser(idToken)).isu;
            const eventDto: CreateEventDto = { ...data, userId: isu };
            const event = await this.eventsService.createEvent(eventDto);
            return { id: event?.id };
        } catch (e) {
            console.log(`[LOG] createForm: ${e.message as string}`);
            return { null: undefined };
        }
    }

    @ApiOperation({ summary: 'Получение мероприятия по id' })
    @ApiResponse({ status: 200, type: Event })
    @Roles('ADMIN')
    @Get(':id')
    async getEvent (@Param() params): Promise<Event | null> {
        try {
            return await this.eventsService.getEvent(params.id);
        } catch (e) {
            console.log(`[LOG] getEvent: ${e.message as string}`);
            return null;
        }
    }

    @Roles('USER')
    @Get('register/:id')
    async register (@Param() params, @Cookies('id_token') idToken: string): Promise<object> {
        // должна произвестись проверка может ли пользователь зарегистрироваться на это меро ( есть ли он в таблице рег)
        // если пользователь зареган вернуть соответствующий месседж
        // если регистрация возможна вернуть форму меро

        const event = await this.eventsService.getEvent(params.id);
        if (event !== null) {
            const userId = this.userService.decodeUser(idToken).isu;
            const canRegister = await this.regService.canRegister(params.id, userId);
            if (canRegister) {
                const eventForm = await this.formsService.getFormById(event.formId);
                return { form: eventForm };
            } else {
                return { message: 'Вы уже зарегистрированы' };
            }
        }
        return { null: undefined };
    }

    // @ApiOperation({ summary: 'Получение мероприятия по id' })
    // @ApiResponse({ status: 200, type: Event })
    @Roles('EVENTADMIN', 'ADMIN')
    @Patch(':id')
    async editEvent (@Body() data: CreateEventDto): Promise<boolean> {
        try {
            // продумать редактирование меро, есди редачится форма то чистить реги
            await this.eventsService.editEvent(data);
            return true;
        } catch (e) {
            console.log(`[LOG] getEvent: ${e.message as string}`);
            return false;
        }
    }

    @Roles('EVENTADMIN', 'ADMIN')
    @Delete('delete')
    async deleteEvent (@Cookies('id_token') idToken: string, @Body() id: number): Promise<void> {
        const isu = (this.userService.decodeUser(idToken)).isu;
        const event = await this.eventsService.getEvent(id);
        if (event !== null && event?.userId === isu) {
            await this.eventsService.deleteEvent(id);
            await this.regService.deleteReg(id);
        }
    }
}
