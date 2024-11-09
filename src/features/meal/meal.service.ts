import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Meal } from './Schemas/meal.schema';
import { CreateMealDto } from './dto/create.meal.dto';
import { MemberService } from '../member/member.service';
import { Member } from '../member/schemas/member.schema';
import { UpdateMemberDto } from '../member/dto/update.member.dto';
import {
  IPagination,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { SummaryService } from '../summary/summary.service';
import { MarketService } from '../market/market.service';
import { Summary } from '../summary/Schemas/summary.schema';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: mongoose.Model<Meal>,
    private readonly memberService: MemberService,
    private readonly summaryService: SummaryService,
    private readonly marketService: MarketService,

    @InjectConnection() private readonly connection: mongoose.Connection,
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
      .sort({ mealDate: order === 'asc' ? 1 : -1 });

    return {
      meal,
      pagination: {
        page: page,
        totalPage: Math.ceil(totalDocument / limit),
        limit: limit,
      },
    };
  }
  async findByDate(date: Date): Promise<Meal[]> {
    const dateObj = new Date(date);
    const start = new Date(dateObj.setHours(0, 0, 0, 0));
    const end = new Date(dateObj.setHours(23, 59, 59, 999));
    const meals = await this.mealModel.find({
      mealDate: { $gte: start, $lte: end },
    });
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
  ): Promise<{ meals: Meal[]; summaries: Summary[] }> {
    {
      const session = await this.connection.startSession();

      try {
        session.startTransaction();
        const foundMeals = await this.findByDate(createMealDto?.mealDate);

        console.log(foundMeals);
        if (foundMeals.length > 0) {
          throw new BadRequestException('meal for this date already exists');
        }

        const mealData = [];
        const Summary = [];

        const marketData = await this.marketService.findAllMarket();
        const totalPriceSum = marketData.market.reduce(
          (sum, currentMarket) => sum + currentMarket.totalPrice,
          0,
        );

        const meal = await this.mealModel.find();
        const totalMealSum = meal.reduce(
          (sum, currentMeal) => sum + currentMeal.mealQuantity,
          0,
        );

        const mealRate = Number(totalPriceSum) / Number(totalMealSum);

        for (const mealItem of createMealDto.meals) {
          const member = await this.memberService.findById(mealItem.member);
          if (!member) {
            throw new NotFoundException(`member with id not found`);
          }
          const memberSummary = await this.summaryService.findByMemberId(
            mealItem?.member,
          );
          if (!memberSummary) {
            throw new NotFoundException('member summary not found');
          }

          mealData.push({
            mealDate: createMealDto.mealDate,
            mealQuantity: mealItem.mealQuantity,
            member: mealItem.member,
          });

          const newMealQuantity =
            Number(memberSummary.mealQuantity || 0) +
            Number(mealItem?.mealQuantity || 0);
          const newTotalCost = Number(
            Number(newMealQuantity || 0) * Number(mealRate || 0),
          );

          const newSummaryAmount =
            Number(memberSummary.depositAmount || 0) -
            Number(Number(newMealQuantity || 0) * Number(mealRate || 0));

          Summary.push({
            _id: memberSummary._id,
            member: mealItem.member,
            mealRate: mealRate || 0,
            mealQuantity: newMealQuantity,
            depositAmount: memberSummary.depositAmount || 0,
            totalCost: newTotalCost || 0,
            summaryAmount: newSummaryAmount,
          });
        }

        const meals = await this.mealModel.insertMany(mealData, {
          session,
        });

        const summaries = await this.summaryService.updateSummaries(Summary);

        await session.commitTransaction();
        return { meals: meals, summaries: summaries };
      } catch (error) {
        console.log({ error });
        await session.abortTransaction();
        throw error;
      } finally {
        await session.endSession();
      }
    }
  }

  async findAllMeal(): Promise<{
    meal: Meal[];
  }> {
    const meal = await this.mealModel.find();
    return {
      meal,
    };
  }
}
