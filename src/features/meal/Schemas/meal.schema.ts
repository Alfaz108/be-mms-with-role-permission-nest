import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Meal extends Document {
  @Prop({ type: Date, required: true })
  mealDate: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member',
    required: true,
  })
  member: mongoose.Types.ObjectId;

  @Prop({ type: Number, default: 0, required: true })
  mealQuantity: number;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
