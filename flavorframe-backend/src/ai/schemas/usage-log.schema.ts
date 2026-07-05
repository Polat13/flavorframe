import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) 
export class UsageLog extends Document {
  @Prop({ required: true })
  styleId!: string;

  @Prop({ required: true, enum: ['SUCCESS', 'ERROR'] })
  status!: string;
}

export const UsageLogSchema = SchemaFactory.createForClass(UsageLog);