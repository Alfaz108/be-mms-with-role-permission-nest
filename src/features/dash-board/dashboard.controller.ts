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
import { DashboardService } from './dashboard.service';
import { Dashboard } from './Schemas/dashboard.schema';
import { RolesGuard } from '../../common/decorator/roles.guard';
import { ROLE_ENUM } from '../../constant/enums/role.enum';
import { Roles } from '../../common/decorator/roles.decorator';
import { Pagination } from '../../common/decorator/pagination.decorator';
import {
  IPagination,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';

@Controller('dash-board')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // GET all bazars
  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MEMBER, ROLE_ENUM.MANAGER, ROLE_ENUM.ADMIN)
  async getDashboardData(): Promise<Dashboard> {
    const data = await this.dashboardService.findAll();
    return data;
  }
}
