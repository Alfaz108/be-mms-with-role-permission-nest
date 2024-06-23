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
} from 'src/common/interfaces/pagination.interface';
import { ROLE_ENUM } from 'src/constant/enums/role.Enam';
import { UserService } from 'src/features/user/user.service';
import { CreateUserDto } from 'src/features/user/dto/createUser.dto';
import { UpdateMemberDto } from './dto/update.member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: mongoose.Model<Member>,
    private readonly UserService: UserService,
  ) {}

  async findAll(
    pagination: IPagination,
  ): Promise<{ member: Member[]; pagination: PaginationOptions }> {
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
        currentPage: page,
        totalPage: Math.ceil(totalDocument / limit),
        allDataCount: totalDocument,
      },
    };
  }

  async findAllActive(): Promise<Member[]> {
    return this.memberModel.find({ status: 'ACTIVE' });
  }

  async create(createMemberDto: CreateMemberDto): Promise<{ member: Member }> {
    const findMember = await this.memberModel.findOne({
      mobile: createMemberDto.mobile,
    });
    if (findMember) {
      throw new UnauthorizedException('Member already exists!');
    }

    const createdMember = await this.memberModel.create(createMemberDto);

    const password = 'MMS12345';
    const createUser: CreateUserDto = {
      name: createMemberDto.name,
      mobile: createMemberDto.mobile,
      roomNumber: createMemberDto.roomNumber,
      password: password,
      role: ROLE_ENUM.MEMBER,
      month: createMemberDto.month,
    };

    const user = await this.UserService.create(createUser);

    return { member: createdMember };
  }

  async findById(id: mongoose.Types.ObjectId): Promise<Member> {
    const member = await this.memberModel.findById(id);
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
