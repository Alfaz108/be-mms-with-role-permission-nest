import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Deposit } from './Schemas/deposit.schema';
import { createDepositDto } from './dto/create.deposit.dto';
import {
  IPagination,
  PaginationOptions,
} from 'src/common/interfaces/pagination.interface';
import { MemberService } from '../member/member.service';
import { Member } from '../member/schemas/member.schema';
import { UpdateMemberDto } from '../member/dto/update.member.dto';

@Injectable()
export class DepositService {
  constructor(
    @InjectModel(Deposit.name)
    private readonly depositModel: mongoose.Model<Deposit>,
    private readonly memberService: MemberService,
  ) {}

  async findAll(
    pagination: IPagination,
  ): Promise<{ diposit: Deposit[]; pagination: PaginationOptions }> {
    const { page, limit, order } = pagination;

    const totalDocument = await this.depositModel.countDocuments();
    const diposit = await this.depositModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ clientId: order === 'asc' ? 1 : -1 });

    return {
      diposit,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(totalDocument / limit),
        allDataCount: totalDocument,
      },
    };
  }

  async create(
    deposit: createDepositDto,
  ): Promise<{ deposit: Deposit; member: Member }> {
    const member = await this.memberService.findById(deposit?.member);
    if (!member) {
      throw new NotFoundException('member not found');
    }

    const newDepositAmount =
      Number(deposit?.depositAmount) + Number(member?.depositAmount);

    const createdDeposit = await this.depositModel.create(deposit);

    const newSummaryAmount = Number(deposit?.depositAmount) + 0;

    // const summaryUpdateDto = {
    //   member: member?._id,
    //   mealRate: member?.mealRate,
    //   mealQuantity: member?.mealQuantity,
    //   totalCost: member?.totalCost,
    //   depositAmount: newDepositAmount,
    //   summaryAmount: newSummaryAmount,
    // };

    const updateBorderDto: UpdateMemberDto = {
      name: member.name,
      mobile: member.mobile,
      roomNumber: member.roomNumber,
      depositAmount: newDepositAmount,
      mealQuantity: member.mealQuantity,
      status: member.status,
      summaryAmount: newSummaryAmount,
      month: member?.month,
      mealRate: member?.mealRate,
      totalCost: member?.totalCost,
    };

    const borderUpdate = await this.memberService.updateById(
      deposit?.member,
      updateBorderDto,
    );

    return {
      deposit: createdDeposit,
      member: borderUpdate,
    };
  }
}
