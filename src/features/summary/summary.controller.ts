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
import { SummaryService } from './summary.service';
import { Summary } from './Schemas/summary.schema';
import { RolesGuard } from '../../common/decorator/roles.guard';
import { ROLE_ENUM } from '../../constant/enums/role.enum';
import { Roles } from '../../common/decorator/roles.decorator';
import { Pagination } from '../../common/decorator/pagination.decorator';
import {
  IPagination,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import mongoose from 'mongoose';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  // GET all bazars
  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MEMBER, ROLE_ENUM.MANAGER, ROLE_ENUM.ADMIN)
  async getAllMemberSummary(
    @Pagination() pagination: IPagination,
  ): Promise<{ data: Summary[]; pagination: PaginationOptions }> {
    const { summary, pagination: paginationOptions } =
      await this.summaryService.findAll(pagination);
    return { data: summary, pagination: paginationOptions };
  }

  //@ GET a member by ID
  @Get(':memberId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MEMBER)
  async getSingleMember(
    @Param('memberId') memberId: mongoose.Types.ObjectId,
  ): Promise<Summary> {
    return this.summaryService.findByMemberId(memberId);
  }
}
