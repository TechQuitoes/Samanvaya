import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type TaskDocument = Task & Document;

export enum TaskModuleType {
  GENERAL = 'GENERAL',
  TRAVEL = 'TRAVEL',
  MEETING = 'MEETING',
  EVENT = 'EVENT',
}

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
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true, default: '' })
  description?: string;

  @Prop({
    type: String,
    enum: TaskModuleType,
    default: TaskModuleType.GENERAL,
    index: true,
  })
  moduleType: TaskModuleType;

  @Prop({ type: Types.ObjectId, required: false, index: true })
  moduleRefId?: Types.ObjectId; // e.g. Travel _id, Meeting _id

  @Prop({ type: String, required: false, default: '' })
  moduleTitle?: string; // e.g. "Mumbai → Vrindavan Tour"

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  assignedTo: Types.ObjectId | User; // Leader / Sevak

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  assignedBy: Types.ObjectId | User; // Admin / Creator

  @Prop({
    type: String,
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Prop({
    type: String,
    enum: TaskStatus,
    default: TaskStatus.PENDING,
    index: true,
  })
  status: TaskStatus;

  @Prop({ type: Date, required: false })
  dueDate?: Date;

  @Prop({ type: Date, required: false })
  completedAt?: Date;

  @Prop({
    type: [
      {
        author: { type: Types.ObjectId, ref: 'User', required: true },
        authorName: { type: String, default: '' },
        commentText: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  comments: {
    author: Types.ObjectId | User;
    authorName?: string;
    commentText: string;
    createdAt: Date;
  }[];

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        fileType: { type: String, default: 'file' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  attachments: {
    name: string;
    url: string;
    fileType: string;
    uploadedAt: Date;
  }[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// Composite indexes for fast queries
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ moduleType: 1, moduleRefId: 1 });
TaskSchema.index({ createdAt: -1 });
