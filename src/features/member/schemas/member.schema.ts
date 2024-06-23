import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { STATUS_ENUM } from 'src/constant/enums/status.Enam';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Member extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, trim: true })
  mobile: string;

  @Prop({ type: String, required: true })
  roomNumber: string;

  @Prop({ type: Number, default: 0, required: true })
  depositAmount: number;

  @Prop({ type: Number, default: 0, required: true })
  mealQuantity: number;

  @Prop({ type: Number, default: 0, required: true })
  mealRate: number;

  @Prop({ type: Number, default: 0, required: true })
  totalCost: number;

  @Prop({ type: Date, required: true })
  month: Date;

  @Prop({ type: Number, default: 0, required: true })
  summaryAmount: number;

  @Prop({ type: String, enum: STATUS_ENUM, required: true })
  status: STATUS_ENUM;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
