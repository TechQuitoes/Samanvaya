import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum LeaderStatus {
  TRAVELLING = 'TRAVELLING',
  STAYING = 'STAYING',
  MEETING = 'MEETING',
  REST = 'REST',
}

export type LeaderProfileDocument = LeaderProfile & Document;

@Schema({ timestamps: true })
export class LeaderProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ default: 'Leader' })
  designation: string;

  @Prop({ default: '' })
  biography: string;

  @Prop()
  dob?: Date;

  @Prop({ default: 'Indian' })
  nationality: string;

  @Prop({ default: 'O+' })
  bloodGroup: string;

  @Prop({
    type: [
      {
        name: String,
        relation: String,
        phone: String,
      },
    ],
    default: [],
  })
  emergencyContacts: Array<{
    name: string;
    relation: string;
    phone: string;
  }>;

  @Prop({ type: String, enum: LeaderStatus, default: LeaderStatus.STAYING })
  currentStatus: LeaderStatus;

  @Prop({ default: '' })
  currentCity: string;

  @Prop({ type: Types.ObjectId, ref: 'Temple' })
  currentTempleId?: Types.ObjectId;

  @Prop({ default: '' })
  residenceAddress: string;

  @Prop({ default: Date.now })
  lastUpdatedLocAt: Date;

  @Prop({ default: '' })
  profilePhotoUrl: string;

  @Prop({
    type: [
      {
        title: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  officialDocuments: Array<{
    title: string;
    fileUrl: string;
    uploadedAt: Date;
  }>;
}

export const LeaderProfileSchema = SchemaFactory.createForClass(LeaderProfile);
