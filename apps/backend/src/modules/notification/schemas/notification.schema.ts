import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  APPROVAL_REQUEST = 'APPROVAL_REQUEST',
  ACCOUNT_APPROVED = 'ACCOUNT_APPROVED',
  ACCOUNT_BLOCKED = 'ACCOUNT_BLOCKED',
  ACCOUNT_REJECTED = 'ACCOUNT_REJECTED',
  TRAVEL = 'TRAVEL',
  TASK = 'TASK',
  GENERAL = 'GENERAL',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  recipient: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  sender?: Types.ObjectId | User;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  body: string;

  @Prop({ type: String, enum: NotificationType, default: NotificationType.GENERAL })
  type: string;

  @Prop({ required: false, default: '/dashboard' })
  actionUrl?: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ type: Boolean, default: false, index: true })
  isRead: boolean;

  @Prop({ type: Date, required: false })
  readAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Index for fast query of user's unread notifications
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
