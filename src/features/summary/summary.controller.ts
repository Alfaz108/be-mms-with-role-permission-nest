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
import { RolesGuard } from 'src/common/decorator/roles.guard';
import { ROLE_ENUM } from 'src/constant/enums/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Pagination } from 'src/common/decorator/pagination.decorator';
import {
  IPagination,
  PaginationOptions,
} from 'src/common/interfaces/pagination.interface';

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
}
