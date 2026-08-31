import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AccommodationType, TransportMode, TravelStatus } from '../schemas/travel.schema';
import { TaskPriority, TaskStatus } from '../schemas/travel-task.schema';

export class TransportDetailDto {
  @IsEnum(TransportMode)
  mode: TransportMode;

  // Flight
  @IsOptional()
  @IsString()
  airline?: string;

  @IsOptional()
  @IsString()
  flightNo?: string;

  @IsOptional()
  @IsString()
  pnr?: string;

  @IsOptional()
  @IsString()
  seatPreference?: string;

  @IsOptional()
  @IsString()
  departureAirport?: string;

  @IsOptional()
  @IsString()
  arrivalAirport?: string;

  @IsOptional()
  @IsDateString()
  departureTime?: string;

  @IsOptional()
  @IsDateString()
  arrivalTime?: string;

  @IsOptional()
  @IsString()
  terminalGateClass?: string;

  // Train
  @IsOptional()
  @IsString()
  trainNameNo?: string;

  @IsOptional()
  @IsString()
  coachSeat?: string;

  @IsOptional()
  @IsString()
  departureStation?: string;

  @IsOptional()
  @IsString()
  arrivalStation?: string;

  @IsOptional()
  @IsString()
  quota?: string;

  // Car
  @IsOptional()
  @IsString()
  carModel?: string;

  @IsOptional()
  @IsString()
  vehicleNo?: string;

  @IsOptional()
  @IsString()
  rentalAgency?: string;

  @IsOptional()
  @IsString()
  bookingRef?: string;

  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @IsOptional()
  @IsString()
  dropoffLocation?: string;

  @IsOptional()
  @IsString()
  tollNotes?: string;

  // Pickup / Cab
  @IsOptional()
  @IsString()
  cabProvider?: string;

  @IsOptional()
  @IsString()
  driverName?: string;

  @IsOptional()
  @IsString()
  driverPhone?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  // Bus
  @IsOptional()
  @IsString()
  busOperator?: string;

  @IsOptional()
  @IsString()
  busType?: string;

  @IsOptional()
  @IsString()
  ticketRef?: string;

  @IsOptional()
  @IsString()
  seatNo?: string;

  @IsOptional()
  @IsString()
  boardingPoint?: string;

  @IsOptional()
  @IsString()
  dropPoint?: string;

  // Other
  @IsOptional()
  @IsString()
  modeDescription?: string;

  @IsOptional()
  @IsString()
  providerName?: string;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsOptional()
  @IsString()
  fromLocation?: string;

  @IsOptional()
  @IsString()
  toLocation?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class StayDetailsDto {
  @IsOptional()
  @IsEnum(AccommodationType)
  type?: AccommodationType;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  bookingRef?: string;

  @IsOptional()
  @IsString()
  contactPersonName?: string;

  @IsOptional()
  @IsString()
  contactPersonPhone?: string;

  @IsOptional()
  @IsDateString()
  checkIn?: string;

  @IsOptional()
  @IsDateString()
  checkOut?: string;
}

export class LocalContactDto {
  @IsString()
  role: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;
}

export class ItineraryItemDto {
  @IsOptional()
  @IsNumber()
  dayNumber?: number;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsString()
  activityTitle: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AttachmentDto {
  @IsString()
  category: string;

  @IsString()
  title: string;

  @IsString()
  fileUrl: string;

  @IsOptional()
  @IsString()
  fileType?: string;

  @IsOptional()
  @IsString()
  key?: string;
}

export class ExpenseDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class CreateTravelDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsString()
  fromLocation: string;

  @IsString()
  destinationCity: string;

  @IsOptional()
  @IsString()
  destinationTempleId?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(TravelStatus)
  status?: TravelStatus;

  @IsOptional()
  @IsBoolean()
  isBackdated?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransportDetailDto)
  transportDetails?: TransportDetailDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => StayDetailsDto)
  stayDetails?: StayDetailsDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalContactDto)
  localContacts?: LocalContactDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItineraryItemDto)
  itinerary?: ItineraryItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseDto)
  expenses?: ExpenseDto[];

  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @IsOptional()
  @IsString()
  generalNotes?: string;
}

export class CreateTravelTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateTravelTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  commentText?: string;
}
