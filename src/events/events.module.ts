import { forwardRef, Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './event.model';
import { UsersModule } from "users/users.module";
import { AuthModule } from "auth/auth.module";

@Module({
    controllers: [EventsController],
    providers: [EventsService],
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(() => AuthModule),
        SequelizeModule.forFeature([Event])
    ]
})
export class EventsModule {

}
