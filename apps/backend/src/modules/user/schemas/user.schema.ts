import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Temple } from '../../temple/schemas/temple.schema';

export type UserDocument = User & Document;

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  SUPER_ADMINISTRATOR = 'Super Administrator',
  ADMIN = 'Admin',
  ADMINISTRATOR = 'Administrator',
  DOCUMENTATION_TEAM = 'Documentation Team',
  TRAVEL_TEAM = 'Travel Team',
  HEALTH_TEAM = 'Health Team',
  FINANCE_TEAM = 'Finance Team',
  VOLUNTEER_SEVAK = 'Volunteer/Sevak',
  VIEWER = 'Viewer',
}

export enum UserStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: false, select: false })
  password?: string;

  @Prop({ required: false, trim: true })
  mobile?: string;

  @Prop({ required: false, unique: true, sparse: true })
  googleId?: string;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ type: String, enum: AuthProvider, default: AuthProvider.LOCAL })
  authProvider: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Temple', required: false })
  temple?: Temple;

  @Prop({ type: String, enum: UserRole, default: UserRole.VIEWER })
  role: string;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.PENDING_APPROVAL })
  status: string;

  @Prop({ type: Object, default: {} })
  permissions: Record<string, Record<string, boolean>>;

  @Prop({
    type: [
      {
        endpoint: { type: String, required: true },
        keys: {
          p256dh: { type: String, required: true },
          auth: { type: String, required: true },
        },
        userAgent: { type: String, required: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  pushSubscriptions: Array<{
    endpoint: string;
    keys: { p256dh: string; auth: string };
    userAgent?: string;
    createdAt?: Date;
  }>;
}

export const UserSchema = SchemaFactory.createForClass(User);

