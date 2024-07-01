import { IsDateString, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class createDepositDto {
  @IsNotEmpty({ message: 'date is required' })
  @IsDateString()
  depositDate: Date;

  @IsNotEmpty({ message: 'member is required' })
  @IsMongoId()
  member: Types.ObjectId;

  @IsNotEmpty({ message: 'deposit amount is required' })
  @IsNumber()
  depositAmount: number;
}
