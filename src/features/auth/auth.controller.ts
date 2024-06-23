import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/signup')
  async registration(@Body() user: RegistrationDto) {
    const data = await this.userService.create(user);
    return {
      data,
      message: 'User created successfully',
    };
  }

  @Post('/login')
  async login(@Body() loginDto: loginDto) {
    const { token, user } = await this.authService.login(loginDto);
    return {
      data: { token, user },
      message: 'Login successfully',
    };
  }
}
