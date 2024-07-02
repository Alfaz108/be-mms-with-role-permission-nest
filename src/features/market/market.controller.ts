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
import { MarketService } from './market.service';
import { Market } from './schemas/market.schema';
import { CreateMarketDto } from './dto/create.market.dto';
import { UpdateMarketDto } from './dto/update.marker.dto';
import { RolesGuard } from '../../common/decorator/roles.guard';
import { ROLE_ENUM } from '../../constant/enums/role.enum';
import { Roles } from '../../common/decorator/roles.decorator';
import {
  IPagination,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { Pagination } from '../../common/decorator/pagination.decorator';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  // GET all market
  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MANAGER)
  async getAllMarkets(
    @Pagination() pagination: IPagination,
  ): Promise<{ data: Market[]; pagination: PaginationOptions }> {
    const { market, pagination: paginationOptions } =
      await this.marketService.findAll(pagination);
    return { data: market, pagination: paginationOptions };
  }

  // POST a new market
  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MANAGER)
  async create(@Body() createMarketDto: CreateMarketDto) {
    try {
      const data = await this.marketService.create(createMarketDto);
      return {
        data,
        message: 'market created successfully',
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'market created failed',
      };
    }
  }

  // GET a market by ID
  @Get(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MANAGER)
  async getMarketById(@Param('id') id: string): Promise<Market> {
    return this.marketService.findById(id);
  }

  // // PUT update a market by ID
  @Put(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MANAGER)
  async updateMarket(
    @Param('id') id: string,
    @Body() updatemarketDto: UpdateMarketDto,
  ) {
    try {
      const data = await this.marketService.updateById(id, updatemarketDto);
      return {
        data,
        message: 'market update successfully',
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'market update failed',
      };
    }
  }

  // // DELETE a market by ID
  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MANAGER)
  async deleteMarket(@Param('id') id: string) {
    try {
      const data = await this.marketService.deleteById(id);
      return {
        data,
        message: 'market delete successfully',
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'market delete failed',
      };
    }
  }
}
