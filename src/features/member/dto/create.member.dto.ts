import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ROLE_ENUM } from 'src/constant/enums/role.enum';
import { STATUS_ENUM } from 'src/constant/enums/status.enum';

export class CreateMemberDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be valid' })
  @MinLength(2, { message: 'Minimum length should be 2 characters' })
  name: string;

  @IsNotEmpty({ message: 'Mobile is required' })
  @IsString({ message: 'Mobile must be valid' })
  mobile: string;

  @IsNotEmpty()
  @IsString({ message: 'Room Number must be valid' })
  roomNumber: string;

  @IsNotEmpty({ message: 'status is required' })
  @IsEnum(STATUS_ENUM)
  status: STATUS_ENUM;
}
