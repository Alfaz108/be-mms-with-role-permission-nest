import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Deposit } from './Schemas/deposit.schema';
import { createDepositDto } from './dto/create.deposit.dto';
import {
  IPagination,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { MemberService } from '../member/member.service';
import { Member } from '../member/schemas/member.schema';
import { UpdateMemberDto } from '../member/dto/update.member.dto';
import { UpdateSummaryDto } from '../summary/dto/update.summary.dto';
import { SummaryService } from '../summary/summary.service';
import { Summary } from '../summary/Schemas/summary.schema';

@Injectable()
export class DepositService {
  constructor(
    @InjectModel(Deposit.name)
    private readonly depositModel: mongoose.Model<Deposit>,
    private readonly memberService: MemberService,
    private readonly summaryService: SummaryService,
  ) {}

  async findAll(
    pagination: IPagination,
  ): Promise<{ deposit: Deposit[]; pagination: PaginationOptions }> {
    const { page, limit, order } = pagination;

    const totalDocument = await this.depositModel.countDocuments();
    const deposit = await this.depositModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ clientId: order === 'asc' ? 1 : -1 });

    return {
      deposit,
      pagination: {
        page: page,
        totalPage: Math.ceil(totalDocument / limit),
        limit: limit,
      },
    };
  }

  async create(
    createDepositDto: createDepositDto,
  ): Promise<{ deposit: Deposit; summary: Summary }> {
    const member = await this.memberService.findById(createDepositDto?.member);
    if (!member) {
      throw new NotFoundException('member not found');
    }

    const memberSummary = await this.summaryService.findByMemberId(
      createDepositDto?.member,
    );
    if (!memberSummary) {
      throw new NotFoundException('member summary not found');
    }

    const createdDeposit = await this.depositModel.create(createDepositDto);

    const newDepositAmount =
      Number(createDepositDto.depositAmount) +
      Number(memberSummary.depositAmount);

    const newSummaryAmount =
      Number(newDepositAmount) - Number(memberSummary.totalCost);

    const updateSummary: UpdateSummaryDto = {
      member: createDepositDto.member,
      mealRate: memberSummary.mealRate,
      mealQuantity: memberSummary.mealQuantity,
      depositAmount: newDepositAmount,
      totalCost: memberSummary.totalCost,
      summaryAmount: newSummaryAmount,
    };
    const summary = await this.summaryService.updateById(
      memberSummary._id.toString(),
      updateSummary,
    );

    return {
      deposit: createdDeposit,
      summary: summary,
    };
  }
}
