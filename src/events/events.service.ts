import { Injectable } from '@nestjs/common';
import { type CreateEventDto } from 'events/dto/create-event.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from 'events/event.model';

@Injectable()
export class EventsService {
    constructor (@InjectModel(Event) private readonly eventRepository: typeof Event) {}

    async fetchEvents (): Promise<Event[]> {
        return await this.eventRepository.findAll();
    }

    async getEvent (id: number): Promise<Event | null> {
        return await this.eventRepository.findOne({ where: { id } });
    }

    async createEvent (dto: CreateEventDto): Promise<Event> {
        return await this.eventRepository.create(dto);
    }
}
