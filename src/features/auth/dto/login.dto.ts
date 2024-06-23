import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class loginDto {
  @IsNotEmpty({ message: 'mobile is required' })
  @IsString({ message: 'Please enter a correct mobile number' })
  mobile: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  @MinLength(6, { message: 'Minimum password length should be 6 characters' })
  password: string;
}
