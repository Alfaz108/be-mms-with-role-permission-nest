import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export class MealChield extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member',
    required: true,
  })
  member: mongoose.Types.ObjectId;

  @Prop({ type: Number, default: 0, required: true })
  mealQuantity: number;
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Meal extends Document {
  @Prop({ type: Date, required: true })
  mealDate: Date;

  @Prop({
    type: [MealChield],
    required: true,
  })
  meals: MealChield[];
}

export const MealSchema = SchemaFactory.createForClass(Meal);
