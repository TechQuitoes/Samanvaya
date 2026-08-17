import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Temple } from '../../temple/schemas/temple.schema';

export type UserDocument = User & Document;

export enum UserRole {
  SUPER_ADMIN = 'Super Administrator',
  ADMIN = 'Administrator',
  DATA_ENTRY_OPERATOR = 'Data Entry Operator',
  DEPARTMENT_USER = 'Department User',
  VIEWER = 'Viewer',
}

export enum UserStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, trim: true })
  mobile: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Temple', required: false })
  temple?: Temple;

  @Prop({ type: String, enum: UserRole, default: UserRole.VIEWER })
  role: string;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.PENDING_APPROVAL })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
