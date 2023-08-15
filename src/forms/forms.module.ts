import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Form } from './form.model';

@Module({
    providers: [FormsService],
    controllers: [FormsController],
    imports: [
        SequelizeModule.forFeature([Form])
    ]
})
export class FormsModule {}
