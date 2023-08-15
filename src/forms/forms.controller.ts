import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Формы')
@Controller('forms')
export class FormsController {}
