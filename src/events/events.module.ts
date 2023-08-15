import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './event.model';

@Module({
    controllers: [EventsController],
    providers: [EventsService],
    imports: [
        SequelizeModule.forFeature([Event])
    ]
})
export class EventsModule {}
