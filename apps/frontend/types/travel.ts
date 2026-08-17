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

export interface TransportDetail {
  mode: TransportMode;
  flightNo?: string;
  pnr?: string;
  trainNo?: string;
  seatNo?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNo?: string;
  departureTime?: string;
  arrivalTime?: string;
  notes?: string;
}

export interface StayDetails {
  type?: AccommodationType;
  name?: string;
  address?: string;
  contactPersonName?: string;
  contactPersonPhone?: string;
  checkIn?: string;
  checkOut?: string;
}

export interface LocalContact {
  role: string;
  name: string;
  phone: string;
  email?: string;
}

export interface TravelAttachment {
  category: string;
  title: string;
  fileUrl: string;
  fileType?: string;
  uploadedAt?: string;
}

export interface TravelExpense {
  _id?: string;
  title: string;
  category: string;
  amount: number;
  currency: string;
  receiptUrl?: string;
  paymentMethod?: string;
  createdAt?: string;
}

export interface Travel {
  _id: string;
  leaderId: {
    _id: string;
    name: string;
    email: string;
    mobile: string;
  };
  title: string;
  purpose: string;
  fromLocation: string;
  destinationCity: string;
  destinationTempleId?: {
    _id: string;
    name: string;
    city: string;
    state: string;
  };
  startDate: string;
  endDate: string;
  status: TravelStatus;
  isBackdated: boolean;
  transportDetails: TransportDetail[];
  stayDetails: StayDetails;
  localContacts: LocalContact[];
  attachments: TravelAttachment[];
  expenses: TravelExpense[];
  specialInstructions?: string;
  generalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TravelTaskComment {
  authorId: string;
  authorName: string;
  commentText: string;
  createdAt: string;
}

export interface TravelTask {
  _id: string;
  travelId: string;
  leaderId: string;
  title: string;
  description: string;
  assigneeId?: {
    _id: string;
    name: string;
    email: string;
  };
  priority: TaskPriority;
  dueDate?: string;
  status: TaskStatus;
  attachments: Array<{ title: string; fileUrl: string }>;
  comments: TravelTaskComment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTravelPayload {
  title: string;
  purpose?: string;
  fromLocation: string;
  destinationCity: string;
  destinationTempleId?: string;
  startDate: string;
  endDate: string;
  status?: TravelStatus;
  isBackdated?: boolean;
  transportDetails?: TransportDetail[];
  stayDetails?: StayDetails;
  localContacts?: LocalContact[];
  attachments?: TravelAttachment[];
  expenses?: TravelExpense[];
  specialInstructions?: string;
  generalNotes?: string;
}
