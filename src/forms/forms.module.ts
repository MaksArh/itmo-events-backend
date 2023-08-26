import { forwardRef, Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Form } from './form.model';
import { UsersModule } from 'users/users.module';
import { AuthModule } from 'auth/auth.module';

@Module({
    providers: [FormsService],
    controllers: [FormsController],
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(() => AuthModule),
        SequelizeModule.forFeature([Form])
    ]
})
export class FormsModule {}
