import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ROLE_ENUM } from '../../../constant/enums/role.enum';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User extends Document {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member',
  })
  member: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  mobile: string;

  @Prop({ type: String })
  roomNumber: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: ROLE_ENUM, required: true })
  role: ROLE_ENUM;
}

export const UserSchema = SchemaFactory.createForClass(User);
