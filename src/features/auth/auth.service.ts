import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async login(loginDto: loginDto): Promise<{ token: string; user: User }> {
    const { mobile, password } = loginDto;

    const user = await this.userService.getUserByMobile(mobile);
    if (!user) {
      throw new UnauthorizedException('Invalid mobile or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid mobile or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token, user };
  }
}
