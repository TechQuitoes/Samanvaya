import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TravelStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TransportMode {
  FLIGHT = 'FLIGHT',
  TRAIN = 'TRAIN',
  CAR = 'CAR',
  BUS = 'BUS',
  PICKUP = 'PICKUP',
  OTHER = 'OTHER',
}

export enum AccommodationType {
  TEMPLE = 'TEMPLE',
  HOTEL = 'HOTEL',
  GUEST_HOUSE = 'GUEST_HOUSE',
  OTHER = 'OTHER',
}

export type TravelDocument = Travel & Document;

@Schema({ timestamps: true })
export class Travel {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  leaderId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: 'Preaching & Temple Seva Tour' })
  purpose: string;

  @Prop({ required: true })
  fromLocation: string;

  @Prop({ required: true })
  destinationCity: string;

  @Prop({ type: Types.ObjectId, ref: 'Temple' })
  destinationTempleId?: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: String, enum: TravelStatus, default: TravelStatus.UPCOMING })
  status: TravelStatus;

  @Prop({ default: false })
  isBackdated: boolean;

  @Prop({
    type: [
      {
        mode: { type: String, enum: TransportMode, default: TransportMode.FLIGHT },
        flightNo: String,
        pnr: String,
        trainNo: String,
        seatNo: String,
        driverName: String,
        driverPhone: String,
        vehicleNo: String,
        departureTime: Date,
        arrivalTime: Date,
        notes: String,
      },
    ],
    default: [],
  })
  transportDetails: Array<{
    mode: TransportMode;
    flightNo?: string;
    pnr?: string;
    trainNo?: string;
    seatNo?: string;
    driverName?: string;
    driverPhone?: string;
    vehicleNo?: string;
    departureTime?: Date;
    arrivalTime?: Date;
    notes?: string;
  }>;

  @Prop({
    type: {
      type: { type: String, enum: AccommodationType, default: AccommodationType.TEMPLE },
      name: String,
      address: String,
      contactPersonName: String,
      contactPersonPhone: String,
      checkIn: Date,
      checkOut: Date,
    },
    default: {},
  })
  stayDetails: {
    type?: AccommodationType;
    name?: string;
    address?: string;
    contactPersonName?: string;
    contactPersonPhone?: string;
    checkIn?: Date;
    checkOut?: Date;
  };

  @Prop({
    type: [
      {
        role: String,
        name: String,
        phone: String,
        email: String,
      },
    ],
    default: [],
  })
  localContacts: Array<{
    role: string;
    name: string;
    phone: string;
    email?: string;
  }>;

  @Prop({
    type: [
      {
        category: String,
        title: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  attachments: Array<{
    category: string;
    title: string;
    fileUrl: string;
    fileType?: string;
    uploadedAt?: Date;
  }>;

  @Prop({
    type: [
      {
        title: String,
        category: { type: String, default: 'MISC' },
        amount: Number,
        currency: { type: String, default: 'INR' },
        receiptUrl: String,
        paymentMethod: { type: String, default: 'CASH' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  expenses: Array<{
    title: string;
    category: string;
    amount: number;
    currency: string;
    receiptUrl?: string;
    paymentMethod?: string;
    createdAt: Date;
  }>;

  @Prop({ default: '' })
  specialInstructions: string;

  @Prop({ default: '' })
  generalNotes: string;
}

export const TravelSchema = SchemaFactory.createForClass(Travel);
