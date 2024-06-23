import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose'; // Import mongoose without destructuring

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Market extends Document {
  @Prop({ type: Date, required: true })
  marketDate: Date;

  @Prop({ type: Number, default: 0, required: true })
  totalPrice: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member',
    required: true,
  })
  member: mongoose.Types.ObjectId;
}

export const MarketSchema = SchemaFactory.createForClass(Market);
