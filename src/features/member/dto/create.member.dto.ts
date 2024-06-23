import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ROLE_ENUM } from 'src/constant/enums/role.Enam';
import { STATUS_ENUM } from 'src/constant/enums/status.Enam';

export class CreateMemberDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be valid' })
  @MinLength(2, { message: 'Minimum length should be 2 characters' })
  readonly name: string;

  @IsNotEmpty({ message: 'Mobile is required' })
  @IsString({ message: 'Mobile must be valid' })
  readonly mobile: string;

  @IsNotEmpty()
  @IsString({ message: 'Room Number must be valid' })
  readonly roomNumber: string;

  @IsNotEmpty({ message: 'status is required' })
  @IsEnum(STATUS_ENUM)
  status: STATUS_ENUM;

  @IsNotEmpty({ message: 'meal quantity is required' })
  @IsNumber()
  mealQuantity: number;

  @IsNotEmpty({ message: 'meal rate is required' })
  @IsNumber()
  mealRate: number;

  @IsNotEmpty({ message: 'total cost is required' })
  @IsNumber()
  totalCost: number;

  @IsNotEmpty({ message: 'month is required' })
  @IsDateString()
  month: Date;

  @IsNotEmpty({ message: 'summary amount is required' })
  @IsNumber()
  summaryAmount: number;

  @IsNotEmpty({ message: 'deposit amount is required' })
  @IsNumber()
  depositAmount: number;
}
