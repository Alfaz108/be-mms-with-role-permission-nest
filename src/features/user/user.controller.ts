import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/createUser.dto';
import { RolesGuard } from '../../common/decorator/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { Pagination } from '../../common/decorator/pagination.decorator';
import {
  IPagination,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/update.user.dto';
import { ResetPasswordDto } from './dto/reset.pass.dto';
import { ROLE_ENUM } from '../../constant/enums/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: CreateUserDto) {
    try {
      const data = await this.userService.create(user);
      return {
        data,
        message: 'user created successfully',
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'user creation failed',
      };
    }
  }

  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.ADMIN)
  async getAllUser(
    @Pagination() pagination: IPagination,
  ): Promise<{ data: User[]; pagination: PaginationOptions }> {
    const { member, pagination: paginationOptions } =
      await this.userService.findAll(pagination);
    return { data: member, pagination: paginationOptions };
  }

  @Put(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.ADMIN)
  async updateBorder(
    @Param('id') id: mongoose.Types.ObjectId,
    @Body() user: UpdateUserDto,
  ) {
    try {
      const data = await this.userService.updateById(id, user);
      return {
        data,
        message: 'user update successfully',
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'user update failed',
      };
    }
  }

  @Patch('reset/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ROLE_ENUM.MEMBER, ROLE_ENUM.ADMIN, ROLE_ENUM.MANAGER)
  async resetUserPassword(
    @Param('id') id: mongoose.Types.ObjectId,
    @Body() userPassword: ResetPasswordDto,
  ) {
    try {
      const data = await this.userService.resetPasswordById(id, userPassword);
      return {
        data,
        message: 'password reset successfully',
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'password reset failed',
      };
    }
  }
}
