import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MealService } from './meal.service';
import { Meal } from './Schemas/meal.schema';
import { CreateMealDto } from './dto/create.meal.dto';
import { RolesGuard } from 'src/common/decorator/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ROLE_ENUM } from 'src/constant/enums/role.enum';
import { Pagination } from 'src/common/decorator/pagination.decorator';
import {
  IPagination,
  PaginationOptions,
} from 'src/common/interfaces/pagination.interface';

@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  //@ GET all meal with pagination
  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MEMBER, ROLE_ENUM.MANAGER)
  async getAllMeal(
    @Pagination() pagination: IPagination,
  ): Promise<{ data: Meal[]; pagination: PaginationOptions }> {
    const { meal, pagination: paginationOptions } =
      await this.mealService.findAll(pagination);
    return { data: meal, pagination: paginationOptions };
  }

  //@ GET all active member
  @Get('/active')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MANAGER)
  async getAllActiveMealBorderList(): Promise<
    { mealQuantity: number; member: string }[]
  > {
    return this.mealService.findAllActiveMealMemberList();
  }

  //@ POST a new meal
  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MANAGER)
  async create(@Body() createMealDto: CreateMealDto) {
    const data = await this.mealService.create(createMealDto);
    return {
      data,
      message: 'meal created successfully',
    };
  }
}
