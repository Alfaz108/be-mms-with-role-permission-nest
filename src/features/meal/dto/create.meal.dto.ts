import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

import { Types } from 'mongoose';

class MealChield {
  @IsNotEmpty({ message: 'meal quantity is required' })
  @IsNumber()
  mealQuantity: number;

  @IsNotEmpty({ message: 'member is required' })
  @IsMongoId()
  member: Types.ObjectId;
}

export class CreateMealDto {
  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString()
  mealDate: Date;

  @IsNotEmpty({ message: 'meal is required' })
  @IsArray()
  @ValidateNested({ each: true })
  meals: MealChield[];
}
