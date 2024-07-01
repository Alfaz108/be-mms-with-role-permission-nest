import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import {
  IPagination,
  PaginationOptions,
} from 'src/common/interfaces/pagination.interface';
import { UpdateUserDto } from './dto/update.user.dto';
import { ResetPasswordDto } from './dto/reset.pass.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ user: User }> {
    const { name, mobile, roomNumber, password, role } = createUserDto;

    const findUser = await this.userModel.findOne({
      mobile: mobile,
    });
    if (findUser) {
      throw new UnauthorizedException('user already exists!');
    }

    const hasPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.userModel.create({
      name,
      mobile,
      roomNumber,
      password: hasPassword,
      role,
    });

    return { user: createdUser };
  }

  async getUserByMobile(mobile: string): Promise<User> {
    return this.userModel.findOne({ mobile });
  }

  async findAll(
    pagination: IPagination,
  ): Promise<{ member: User[]; pagination: PaginationOptions }> {
    const { page, limit, order } = pagination;

    const totalDocument = await this.userModel.countDocuments();
    const member = await this.userModel
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

  async updateById(
    id: mongoose.Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const findUser = await this.userModel.findOne({
      _id: id,
    });

    if (!findUser) {
      throw new UnauthorizedException('user not found');
    }

    const updateUser = {
      name: updateUserDto?.name,
      mobile: updateUserDto?.mobile,
      role: updateUserDto?.role,
      roomNumber: updateUserDto?.roomNumber,
      password: findUser?.password,
    };
    const user = await this.userModel.findByIdAndUpdate(id, updateUser, {
      new: true,
      runValidators: true,
    });
    return user;
  }

  async resetPasswordById(
    id: mongoose.Types.ObjectId,
    userPassword: ResetPasswordDto,
  ): Promise<User> {
    const findUser = await this.userModel.findOne({
      _id: id,
    });

    if (!findUser) {
      throw new UnauthorizedException('user not found');
    }

    const hasPassword = await bcrypt.hash(userPassword?.password, 10);

    const updateUser = {
      name: findUser?.name,
      mobile: findUser?.mobile,
      role: findUser?.role,
      roomNumber: findUser?.roomNumber,
      password: hasPassword,
    };

    const user = this.userModel.findByIdAndUpdate(id, updateUser, {
      new: true,
      runValidators: true,
    });
    return user;
  }
}
