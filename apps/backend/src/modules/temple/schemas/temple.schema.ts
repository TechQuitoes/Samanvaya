import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TempleDocument = Temple & Document;

@Schema({ timestamps: true })
export class Temple {
  @Prop({ required: true, trim: true, index: true })
  name: string;

  @Prop({ required: true, trim: true })
  location: string;
}

export const TempleSchema = SchemaFactory.createForClass(Temple);
