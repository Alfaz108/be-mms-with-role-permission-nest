import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { STATUS_ENUM } from 'src/constant/enums/status.enum';

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

  @Prop({ type: String, enum: STATUS_ENUM, required: true })
  status: STATUS_ENUM;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
