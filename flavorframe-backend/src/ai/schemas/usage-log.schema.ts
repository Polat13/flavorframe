// src/ai/schemas/usage-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // createdAt ve updatedAt alanlarını otomatik ekler
export class UsageLog extends Document {
  @Prop({ required: true })
  styleId!: string;

  @Prop({ required: true, enum: ['SUCCESS', 'ERROR'] })
  status!: string;
}

export const UsageLogSchema = SchemaFactory.createForClass(UsageLog);