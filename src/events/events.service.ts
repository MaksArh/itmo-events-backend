import { Injectable } from '@nestjs/common';
import { type CreateEventDto } from 'events/dto/create-event.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from 'events/event.model';
import { FormsService } from 'forms/forms.service';
import { RegsService } from 'regs/regs.service';

@Injectable()
export class EventsService {
    constructor (@InjectModel(Event)
    private readonly eventRepository: typeof Event,
    private readonly formService: FormsService,
    private readonly regRepository: RegsService) {}

    async fetchEvents (): Promise<Event[]> {
        return await this.eventRepository.findAll({ include: [{ all: true }] });
    }

    async getEvent (id: number): Promise<Event | null> {
        return await this.eventRepository.findOne({ where: { id } });
    }

    async createEvent (dto: CreateEventDto): Promise<Event> {
        const event = await this.eventRepository.create(dto);
        const form = await this.formService.getFormById(dto.formId);
        if ((event != null) && (form != null)) {
            await event.$set('form', [form.id]);
            event.form = form;
            await this.regRepository.createReg({ eventId: event?.id });
            return event;
        }
        return event;
    }

    async deleteEvent (id: number): Promise<void> {
        await this.eventRepository.destroy({ where: { id } });
    }
}
