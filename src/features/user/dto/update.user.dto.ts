import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ROLE_ENUM } from '../../../constant/enums/role.enum';
import { Types } from 'mongoose';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be string' })
  @MinLength(2, { message: 'Minimum length should be 2 characters' })
  name: string;

  @IsOptional()
  @IsMongoId()
  member: Types.ObjectId;

  @IsNotEmpty({ message: 'mobile is required' })
  @IsString({ message: 'Please enter a correct mobile number' })
  mobile: string;

  @IsNotEmpty({ message: 'room number is required' })
  @IsString({ message: 'Please enter a correct room number' })
  roomNumber: string;

  @IsNotEmpty({ message: 'role is required' })
  @IsEnum(ROLE_ENUM)
  role: ROLE_ENUM;
}
