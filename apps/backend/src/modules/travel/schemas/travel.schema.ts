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
  ASHRAM = 'ASHRAM',
  DHARAMSHALA = 'DHARAMSHALA',
  OTHER = 'OTHER',
}

export type TravelDocument = Travel & Document;

@Schema({ timestamps: true })
export class Travel {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  leaderId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: 'Official Visit' })
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
        // Flight
        airline: String,
        flightNo: String,
        pnr: String,
        seatPreference: String,
        departureAirport: String,
        arrivalAirport: String,
        departureTime: Date,
        arrivalTime: Date,
        terminalGateClass: String,
        // Train
        trainNameNo: String,
        coachSeat: String,
        departureStation: String,
        arrivalStation: String,
        quota: String,
        // Car
        carModel: String,
        vehicleNo: String,
        rentalAgency: String,
        bookingRef: String,
        pickupLocation: String,
        dropoffLocation: String,
        tollNotes: String,
        // Pickup / Cab
        cabProvider: String,
        driverName: String,
        driverPhone: String,
        instructions: String,
        // Bus
        busOperator: String,
        busType: String,
        ticketRef: String,
        seatNo: String,
        boardingPoint: String,
        dropPoint: String,
        // Other
        modeDescription: String,
        providerName: String,
        referenceNo: String,
        fromLocation: String,
        toLocation: String,
        notes: String,
      },
    ],
    default: [],
  })
  transportDetails: Array<{
    mode: TransportMode;
    airline?: string;
    flightNo?: string;
    pnr?: string;
    seatPreference?: string;
    departureAirport?: string;
    arrivalAirport?: string;
    departureTime?: Date;
    arrivalTime?: Date;
    terminalGateClass?: string;
    trainNameNo?: string;
    coachSeat?: string;
    departureStation?: string;
    arrivalStation?: string;
    quota?: string;
    carModel?: string;
    vehicleNo?: string;
    rentalAgency?: string;
    bookingRef?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    tollNotes?: string;
    cabProvider?: string;
    driverName?: string;
    driverPhone?: string;
    instructions?: string;
    busOperator?: string;
    busType?: string;
    ticketRef?: string;
    seatNo?: string;
    boardingPoint?: string;
    dropPoint?: string;
    modeDescription?: string;
    providerName?: string;
    referenceNo?: string;
    fromLocation?: string;
    toLocation?: string;
    notes?: string;
  }>;

  @Prop({
    type: {
      type: { type: String, enum: AccommodationType, default: AccommodationType.TEMPLE },
      name: String,
      address: String,
      checkIn: Date,
      checkOut: Date,
      bookingRef: String,
      contactPersonName: String,
      contactPersonPhone: String,
    },
    default: {},
  })
  stayDetails: {
    type?: AccommodationType;
    name?: string;
    address?: string;
    checkIn?: Date;
    checkOut?: Date;
    bookingRef?: string;
    contactPersonName?: string;
    contactPersonPhone?: string;
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
        dayNumber: Number,
        date: String,
        time: String,
        activityTitle: String,
        location: String,
        notes: String,
      },
    ],
    default: [],
  })
  itinerary: Array<{
    dayNumber?: number;
    date?: string;
    time?: string;
    activityTitle: string;
    location?: string;
    notes?: string;
  }>;

  @Prop({
    type: [
      {
        category: String,
        title: String,
        fileUrl: String,
        fileType: String,
        key: String,
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
    key?: string;
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
