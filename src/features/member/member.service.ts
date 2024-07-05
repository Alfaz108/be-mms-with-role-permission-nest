import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Member } from './schemas/member.schema';
import { CreateMemberDto } from './dto/create.member.dto';
import * as bcrypt from 'bcryptjs';

import {
  IPagination,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { ROLE_ENUM } from '../../constant/enums/role.enum';
import { UserService } from 'src/features/user/user.service';
import { CreateUserDto } from 'src/features/user/dto/createUser.dto';
import { UpdateMemberDto } from './dto/update.member.dto';
import { SummaryService } from '../summary/summary.service';
import { CreateSummaryDto } from '../summary/dto/create.summary.dto';
import { Summary } from '../summary/Schemas/summary.schema';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: mongoose.Model<Member>,
    private readonly UserService: UserService,
    private readonly summaryService: SummaryService,
  ) {}

  async findAll(
    pagination: IPagination,
  ): Promise<{ member: Member[]; pagination: PaginationOptions }> {
    console.log('ii ');
    const { page, limit, order } = pagination;

    const totalDocument = await this.memberModel.countDocuments();
    const member = await this.memberModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ clientId: order === 'asc' ? 1 : -1 });

    return {
      member,
      pagination: {
        page: page,
        limit: limit,
        totalPage: Math.ceil(totalDocument / limit),
      },
    };
  }

  async findAllActive(): Promise<Member[]> {
    return this.memberModel.find({ status: 'ACTIVE' });
  }

  async create(
    createMemberDto: CreateMemberDto,
  ): Promise<{ member: Member; summary: Summary }> {
    console.log({ createMemberDto });
    //@ Check if member already exists
    const findMember = await this.memberModel.findOne({
      mobile: createMemberDto.mobile,
    });
    if (findMember) {
      throw new UnauthorizedException('Member already exists!');
    }

    //@ Create new member
    const createdMember = await this.memberModel.create(createMemberDto);
    console.log({ createdMember });

    //@ Create user for the member
    const password = 'MMS12345';
    const createUser: CreateUserDto = {
      member: createdMember._id as mongoose.Types.ObjectId,
      name: createMemberDto.name,
      mobile: createMemberDto.mobile,
      roomNumber: createMemberDto.roomNumber,
      password: password,
      role: ROLE_ENUM.MEMBER,
    };

    console.log({ createUser });
    const user = await this.UserService.create(createUser);

    //@ Create summary for the member
    const createSummary: CreateSummaryDto = {
      member: createdMember._id as mongoose.Types.ObjectId,
      mealRate: 0,
      mealQuantity: 0,
      depositAmount: 0,
      totalCost: 0,
      summaryAmount: 0,
    };
    const summary = await this.summaryService.create(createSummary);

    //@ Return the created member and summary
    return { member: createdMember, summary: summary };
  }

  async findById(id: mongoose.Types.ObjectId): Promise<Member> {
    console.log(id);
    const member = await this.memberModel.findById(id);
    console.log({ member });
    return member;
  }

  async updateById(
    id: mongoose.Types.ObjectId,
    updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    return await this.memberModel.findByIdAndUpdate(id, updateMemberDto, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Member> {
    return await this.memberModel.findByIdAndDelete(id);
  }
}
