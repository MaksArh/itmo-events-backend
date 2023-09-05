import { forwardRef, Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './event.model';
import { UsersModule } from 'users/users.module';

@Module({
    controllers: [EventsController],
    providers: [EventsService],
    imports: [
        SequelizeModule.forFeature([Event]),
        forwardRef(() => UsersModule)
    ]
})
export class EventsModule {

}
