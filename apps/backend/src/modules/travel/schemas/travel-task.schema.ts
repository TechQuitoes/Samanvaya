import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export type TravelTaskDocument = TravelTask & Document;

@Schema({ timestamps: true })
export class TravelTask {
  @Prop({ type: Types.ObjectId, ref: 'Travel', required: true })
  travelId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  leaderId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assigneeId?: Types.ObjectId;

  @Prop({ type: String, enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop()
  dueDate?: Date;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Prop({
    type: [
      {
        title: String,
        fileUrl: String,
      },
    ],
    default: [],
  })
  attachments: Array<{ title: string; fileUrl: string }>;

  @Prop({
    type: [
      {
        authorId: { type: Types.ObjectId, ref: 'User' },
        authorName: String,
        commentText: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  comments: Array<{
    authorId: Types.ObjectId;
    authorName: string;
    commentText: string;
    createdAt: Date;
  }>;
}

export const TravelTaskSchema = SchemaFactory.createForClass(TravelTask);
