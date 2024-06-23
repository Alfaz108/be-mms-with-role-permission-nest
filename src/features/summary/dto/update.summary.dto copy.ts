import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

import { Types } from 'mongoose';

export class UpdateSummaryDto {
  @IsNotEmpty({ message: 'member is required' })
  @IsMongoId()
  member: Types.ObjectId;

  @IsNotEmpty({ message: 'meal rate is required' })
  @IsNumber()
  mealRate: number;

  @IsNotEmpty({ message: 'meal quantity amount is required' })
  @IsNumber()
  mealQuantity: number;

  @IsNotEmpty({ message: 'deposit amount is required' })
  @IsNumber()
  depositAmount: number;

  @IsNotEmpty({ message: 'total cost is required' })
  @IsNumber()
  totalCost: number;

  @IsNotEmpty({ message: 'summary amount amount is required' })
  @IsNumber()
  summaryAmount: number;
}
