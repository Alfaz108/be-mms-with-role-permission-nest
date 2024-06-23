import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Meal } from './Schemas/meal.schema';
import { CreateMealDto } from './dto/create.meal.dto';
import { MemberService } from '../member/member.service';
import { Member } from '../member/schemas/member.schema';
import { UpdateMemberDto } from '../member/dto/update.member.dto';
import {
  IPagination,
  PaginationOptions,
} from 'src/common/interfaces/pagination.interface';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: mongoose.Model<Meal>,
    private readonly memberService: MemberService,
  ) {}

  async findAll(
    pagination: IPagination,
  ): Promise<{ meal: Meal[]; pagination: PaginationOptions }> {
    const { page, limit, order } = pagination;

    const totalDocument = await this.mealModel.countDocuments();
    const meal = await this.mealModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ clientId: order === 'asc' ? 1 : -1 });

    return {
      meal,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(totalDocument / limit),
        allDataCount: totalDocument,
      },
    };
  }

  async findByDate(date: Date): Promise<Meal[]> {
    const meals = await this.mealModel.find({ mealDate: date });
    return meals;
  }

  async findAllActiveMealMemberList(): Promise<
    { mealQuantity: number; member: string }[]
  > {
    const activeMembers = await this.memberService.findAllActive();
    const meals = activeMembers.map((member) => ({
      mealQuantity: 0,
      member: member._id.toString(),
    }));

    return meals;
  }

  async create(
    createMealDto: CreateMealDto,
  ): Promise<{ meals: Meal[]; members: Member[] }> {
    const foundMeals = await this.findByDate(createMealDto?.mealDate);
    if (foundMeals.length > 0) {
      throw new NotFoundException('meal for this date already exists');
    }

    const meals = [];
    const members = [];

    for (const mealItem of createMealDto.meals) {
      const member = await this.memberService.findById(mealItem.member);
      if (!member) {
        throw new NotFoundException(`member with id not found`);
      }

      const newMealQuantity =
        Number(mealItem?.mealQuantity) + Number(member.mealQuantity);

      const updateMemberDto: UpdateMemberDto = {
        name: member.name,
        mobile: member.mobile,
        roomNumber: member.roomNumber,
        depositAmount: member.depositAmount,
        mealQuantity: newMealQuantity,
        status: member.status,
        mealRate: member.mealRate,
        totalCost: member?.totalCost,
        month: member?.month,
        summaryAmount: member?.summaryAmount,
      };

      const updatedMember = await this.memberService.updateById(
        mealItem.member,
        updateMemberDto,
      );

      members.push(updatedMember);

      const newMeal = new this.mealModel({
        mealDate: createMealDto.mealDate,
        meals: [
          { mealQuantity: mealItem.mealQuantity, member: mealItem.member },
        ],
      });

      const savedMeal = await newMeal.save();
      meals.push(savedMeal);
    }

    return { meals, members };
  }
}
