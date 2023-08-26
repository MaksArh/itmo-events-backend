import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormsService } from 'forms/forms.service';
import { Form } from 'forms/form.model';
import { UsersService } from 'users/users.service';
import { Cookies } from 'decorators/cookie.decorator';
import { CreateFormDto } from 'forms/dto/create-form.dto';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';

@ApiTags('Формы')
@Controller('forms')
@UseGuards(JwtAuthGuard)
export class FormsController {
    constructor (private readonly formService: FormsService, private readonly userService: UsersService) {}

    @ApiOperation({ summary: 'Получение форы по id' })
    @ApiResponse({ status: 200, type: Form })
    @Get('/:id')
    async getForm (@Param() params): Promise<Form | null> {
        return await this.formService.getFormById(params.id);
    }

    @ApiBody({ type: CreateFormDto, description: 'userId сам подтягивается системой, передавать не надо' })
    @ApiOperation({ summary: 'Создание формы' })
    @ApiResponse({ status: 200, type: Form })
    @Post('create')
    async createForm (@Body() form: Omit<CreateFormDto, 'userId'>, @Cookies('id_token') idToken: string):
    Promise<CreateFormDto | any> {
        try {
            const isu = (this.userService.decodeUser(idToken)).isu;
            const formDto = { ...form, userId: isu };
            return await this.formService.createForm(formDto);
        } catch (e) {
            console.log(`[LOG] createForm: ${e.message as string}`);
            return { null: undefined };
        }
    }
}
