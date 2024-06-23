import { IsNotEmpty, IsString } from 'class-validator';
export class ResetPasswordDto {
  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  readonly password: string;
}
