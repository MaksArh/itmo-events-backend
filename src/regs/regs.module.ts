import { Module } from '@nestjs/common';
import { RegsService } from './regs.service';
import { RegsController } from './regs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Reg } from './reg.model';

@Module({
    providers: [RegsService],
    controllers: [RegsController],
    imports: [
        SequelizeModule.forFeature([Reg])
    ]
})
export class RegsModule {}
