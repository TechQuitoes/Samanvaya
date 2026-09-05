import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum CalendarCategory {
  TRAVEL = 'TRAVEL',
  MEETING = 'MEETING',
  EVENT = 'EVENT',
  HEALTH = 'HEALTH',
  REMINDER = 'REMINDER',
  SADHANA = 'SADHANA',
}

export type CalendarEventDocument = CalendarEvent & Document;

@Schema({ timestamps: true })
export class CalendarEvent {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ type: String, enum: CalendarCategory, default: CalendarCategory.EVENT })
  category: CalendarCategory;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: false })
  isAllDay: boolean;

  @Prop({ default: '' })
  location: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 'CUSTOM' })
  moduleType: string;

  @Prop({ type: String, default: null })
  moduleRefId?: string;

  @Prop({ type: Object, default: {} })
  meta?: Record<string, any>;
}

export const CalendarEventSchema = SchemaFactory.createForClass(CalendarEvent);
