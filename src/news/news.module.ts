import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { News } from './news.model';

@Module({
    controllers: [NewsController],
    providers: [NewsService],
    imports: [
        SequelizeModule.forFeature([News])
    ]
})
export class NewsModule {}
