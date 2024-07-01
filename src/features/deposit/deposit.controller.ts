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
import { DepositService } from './deposit.service';

import { Deposit } from './Schemas/deposit.schema';
import { createDepositDto } from './dto/create.deposit.dto';
import { RolesGuard } from 'src/common/decorator/roles.guard';
import { ROLE_ENUM } from 'src/constant/enums/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Pagination } from 'src/common/decorator/pagination.decorator';
import {
  IPagination,
  PaginationOptions,
} from 'src/common/interfaces/pagination.interface';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  // GET all deposit

  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MANAGER)
  async getAllDeposit(
    @Pagination() pagination: IPagination,
  ): Promise<{ data: Deposit[]; pagination: PaginationOptions }> {
    const { deposit, pagination: paginationOptions } =
      await this.depositService.findAll(pagination);
    return { data: deposit, pagination: paginationOptions };
  }

  // POST a new bazar
  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MANAGER)
  async create(@Body() createDepositDto: createDepositDto) {
    try {
      const data = await this.depositService.create(createDepositDto);
      return {
        data,
        message: 'deposit created successfully',
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'deposit created failed',
      };
    }
  }

  // // GET a bazar by ID
  // @Get(':id')
  // @UseGuards(AuthGuard())
  // async getBazar(@Param('id') id: string): Promise<Bazar> {
  //   return this.depositService.findById(id);
  // }

  // // // PUT update a bazar by ID
  // @Put(':id')
  // @UseGuards(AuthGuard())
  // async updateBazar(@Param('id') id: string, @Body() bazar: updateBazarDto) {
  //   try {
  //     const data = await this.depositService.updateById(id, bazar);
  //     return {
  //       data,
  //       message: 'bazar update successfully',
  //     };
  //   } catch (error) {
  //     return {
  //       error: error.message,
  //       message: 'bazar update failed',
  //     };
  //   }
  // }

  // // // DELETE a bazar by ID
  // @Delete(':id')
  // @UseGuards(AuthGuard())
  // async deleteBazar(@Param('id') id: string) {
  //   try {
  //     const data = await this.depositService.deleteById(id);
  //     return {
  //       data,
  //       message: 'bazar delete successfully',
  //     };
  //   } catch (error) {
  //     return {
  //       error: error.message,
  //       message: 'bazar delete failed',
  //     };
  //   }
  // }
}
