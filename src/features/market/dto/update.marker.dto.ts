import { IsDateString, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateMarketDto {
  @IsNotEmpty({ message: 'date is required' })
  @IsDateString()
  marketDate: Date;

  @IsNotEmpty({ message: 'total price is required' })
  @IsNumber()
  totalPrice: number;

  @IsNotEmpty({ message: 'member is required' })
  @IsMongoId()
  member: Types.ObjectId;
}
