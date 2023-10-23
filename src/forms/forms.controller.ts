import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormsService } from 'forms/forms.service';
import { Form } from 'forms/form.model';
import { UsersService } from 'users/users.service';
import { Cookies } from 'decorators/cookie.decorator';
import { CreateFormDto } from 'forms/dto/create-form.dto';

@ApiTags('Формы')
@Controller('forms')
// @UseGuards(JwtAuthGuard)
export class FormsController {
    constructor (private readonly formService: FormsService, private readonly userService: UsersService) {}

    @ApiOperation({ summary: 'Получение форм' })
    @ApiResponse({ status: 200, type: Form })
    @Get()
    async fetchForms (@Param() params): Promise<Form[]> {
        return await this.formService.fetchForms();
    }

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
    async createForm (@Body() data: Omit<CreateFormDto, 'userId'>, @Cookies('id_token') idToken: string):
    Promise<CreateFormDto | any> {
        try {
            const isu = (this.userService.decodeUser(idToken)).isu;
            const formDto: CreateFormDto = { ...data, userId: isu };
            const form = await this.formService.createForm(formDto);
            return form?.id;
        } catch (e) {
            console.log(`[LOG] createForm: ${e.message as string}`);
            return e.message as string;
        }
    }

    @Delete('delete')
    async deleteForm (@Cookies('id_token') idToken: string, @Body() id: number): Promise<void> {
        const isu = (this.userService.decodeUser(idToken)).isu;
        const form = await this.formService.getFormById(id);
        if (form !== null && form?.userId === isu) {
            await this.formService.deleteForm(id);
        }
    }
}
