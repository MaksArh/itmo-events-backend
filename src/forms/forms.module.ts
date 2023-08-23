import { forwardRef, Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Form } from './form.model';
import { UsersModule } from 'users/users.module';

@Module({
    providers: [FormsService],
    controllers: [FormsController],
    imports: [
        forwardRef(() => UsersModule),
        SequelizeModule.forFeature([Form])
    ]
})
export class FormsModule {}
