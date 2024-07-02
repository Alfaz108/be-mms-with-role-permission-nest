import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Market } from './schemas/market.schema';
import { CreateMarketDto } from './dto/create.market.dto';
import { UpdateMarketDto } from './dto/update.marker.dto';
import { MemberService } from '../member/member.service';
import {
  IPagination,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { MealService } from '../meal/meal.service';
import { CreateSummaryDto } from '../summary/dto/create.summary.dto';
import { UpdateSummaryDto } from '../summary/dto/update.summary.dto';
import { SummaryService } from '../summary/summary.service';
import { Summary } from '../summary/Schemas/summary.schema';

@Injectable()
export class MarketService {
  constructor(
    @InjectModel(Market.name)
    private marketModel: mongoose.Model<Market>,
    private readonly MemberService: MemberService,
    @Inject(forwardRef(() => MealService))
    private readonly mealService: MealService,
    private readonly summaryService: SummaryService,
  ) {}

  async findAll(
    pagination: IPagination,
  ): Promise<{ market: Market[]; pagination: PaginationOptions }> {
    const { page, limit, order } = pagination;

    const totalDocument = await this.marketModel.countDocuments();
    const market = await this.marketModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ clientId: order === 'asc' ? 1 : -1 });

    return {
      market,
      pagination: {
        page: page,
        totalPage: Math.ceil(totalDocument / limit),
        limit: limit,
      },
    };
  }

  async create(
    createMarketDto: CreateMarketDto,
  ): Promise<{ market: Market; summary: Summary[] }> {
    const findMember = await this.MemberService.findById(
      createMarketDto.member,
    );

    if (!findMember) {
      throw new UnauthorizedException('Member not found');
    }

    const market = await this.marketModel.create(createMarketDto);

    const marketData = await this.marketModel.find();
    const totalPriceSum = marketData.reduce(
      (sum, currentMarket) => sum + currentMarket.totalPrice,
      0,
    );

    const mealData = await this.mealService.findAllMeal();
    const totalMealSum = mealData.meal.reduce(
      (sum, currentMeal) => sum + currentMeal.mealQuantity,
      0,
    );
    const mealRate = Number(totalPriceSum || 0) / Number(totalMealSum || 0);

    const memberSummaries = await this.summaryService.findAllSummary();

    const Summary = [];

    for (const summary of memberSummaries.summary) {
      const memberSummary = await this.summaryService.findByMemberId(
        summary.member,
      );
      if (!memberSummary) {
        throw new NotFoundException('member summary not found');
      }
      const newTotalCost =
        Number(mealRate || 0) * Number(summary.mealQuantity || 0);
      const newSummaryAmount =
        Number(summary.depositAmount || 0) - Number(newTotalCost || 0);
      Summary.push({
        _id: summary._id,
        member: summary.member,
        mealRate: mealRate,
        mealQuantity: summary.mealQuantity,
        depositAmount: summary.depositAmount,
        totalCost: newTotalCost,
        summaryAmount: newSummaryAmount,
      });
    }
    const summaries = await this.summaryService.updateSummaries(Summary);

    return { market, summary: summaries };
  }

  async findById(id: string): Promise<Market> {
    const bazar = await this.marketModel.findById(id);
    return bazar;
  }

  async updateById(
    id: string,
    updatemarketdto: UpdateMarketDto,
  ): Promise<Market> {
    return await this.marketModel.findByIdAndUpdate(id, updatemarketdto, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Market> {
    return await this.marketModel.findByIdAndDelete(id);
  }

  async findAllMarket(): Promise<{
    market: Market[];
  }> {
    const market = await this.marketModel.find();
    return {
      market,
    };
  }
}
