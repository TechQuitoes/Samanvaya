export enum LeaderStatus {
  TRAVELLING = 'TRAVELLING',
  STAYING = 'STAYING',
  MEETING = 'MEETING',
  REST = 'REST',
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface OfficialDocument {
  title: string;
  fileUrl: string;
  uploadedAt?: string;
}

export interface LeaderProfile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
  };
  designation: string;
  biography: string;
  dob?: string;
  nationality: string;
  bloodGroup: string;
  emergencyContacts: EmergencyContact[];
  currentStatus: LeaderStatus;
  currentCity: string;
  currentTempleId?: {
    _id: string;
    name: string;
    city: string;
    state: string;
  };
  residenceAddress: string;
  lastUpdatedLocAt: string;
  profilePhotoUrl: string;
  officialDocuments: OfficialDocument[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateLeaderLocationPayload {
  currentStatus: LeaderStatus;
  currentCity: string;
  currentTempleId?: string;
  residenceAddress?: string;
}
