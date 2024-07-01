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
import { MemberService } from './member.service';
import { Member } from './schemas/member.schema';
import { AuthGuard } from '@nestjs/passport';
import { CreateMemberDto } from './dto/create.member.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ROLE_ENUM } from 'src/constant/enums/role.enum';
import { RolesGuard } from 'src/common/decorator/roles.guard';
import {
  IPagination,
  PaginationOptions,
} from 'src/common/interfaces/pagination.interface';
import { Pagination } from 'src/common/decorator/pagination.decorator';
import mongoose from 'mongoose';
import { UpdateMemberDto } from './dto/update.member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  //@ GET all members with pagination
  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MEMBER, ROLE_ENUM.MANAGER, ROLE_ENUM.ADMIN)
  async getAllMember(
    @Pagination() pagination: IPagination,
  ): Promise<{ data: Member[]; pagination: PaginationOptions }> {
    const { member, pagination: paginationOptions } =
      await this.memberService.findAll(pagination);
    return { data: member, pagination: paginationOptions };
  }

  //@ create a new member
  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.ADMIN)
  async create(@Body() member: CreateMemberDto) {
    try {
      const data = await this.memberService.create(member);
      return {
        data,
        message: 'Member created successfully',
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'Member creation failed',
      };
    }
  }

  //@ GET a member by ID
  @Get(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MEMBER, ROLE_ENUM.MANAGER, ROLE_ENUM.ADMIN)
  async getSingleMember(
    @Param('id') id: mongoose.Types.ObjectId,
  ): Promise<Member> {
    return this.memberService.findById(id);
  }

  //@ PUT update a member by ID
  @Put(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MANAGER)
  async updateMember(
    @Param('id') id: mongoose.Types.ObjectId,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    try {
      const data = await this.memberService.updateById(id, updateMemberDto);
      return {
        data,
        message: 'member update successfully',
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'member update failed',
      };
    }
  }
  //@ DELETE a member by ID
  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.ADMIN)
  async deleteMember(@Param('id') id: string) {
    try {
      const data = await this.memberService.deleteById(id);
      return {
        data,
        message: 'border delete successfully',
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'border delete failed',
      };
    }
  }
}
