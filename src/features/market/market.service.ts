import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Market } from './schemas/market.schema';
import { CreateMarketDto } from './dto/create.market.dto';
import { UpdateMarketDto } from './dto/update.marker.dto';
import { MemberService } from '../member/member.service';
import {
  IPagination,
  PaginationOptions,
} from 'src/common/interfaces/pagination.interface';

@Injectable()
export class MarketService {
  constructor(
    @InjectModel(Market.name)
    private marketModel: mongoose.Model<Market>,
    private readonly MemberService: MemberService,
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
        currentPage: page,
        totalPage: Math.ceil(totalDocument / limit),
        allDataCount: totalDocument,
      },
    };
  }

  async create(createMarketDto: CreateMarketDto): Promise<Market> {
    const findMember = await this.MemberService.findById(
      createMarketDto.member,
    );

    if (!findMember) {
      throw new UnauthorizedException('Member not found');
    }
    const res = await this.marketModel.create(createMarketDto);
    return res;
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
}
