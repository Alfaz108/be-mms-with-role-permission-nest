import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Dashboard {
  @Prop({ type: Number, default: 0, required: true })
  totalActiveMember: number;

  @Prop({ type: Number, default: 0, required: true })
  totalInActiveMember: number;

  @Prop({ type: Number, default: 0, required: true })
  totalPositiveMember: number;

  @Prop({ type: Number, default: 0, required: true })
  totalNegativeMember: number;

  @Prop({ type: Number, default: 0, required: true })
  totalDeposit: number;

  @Prop({ type: Number, default: 0, required: true })
  totalCost: number;

  @Prop({ type: Number, default: 0, required: true })
  totalMeal: number;

  @Prop({ type: Number, default: 0, required: true })
  mealRate: number;

  @Prop({ type: Number, default: 0, required: true })
  totalCashInHand: number;
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
