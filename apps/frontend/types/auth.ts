export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
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
}

export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  status: UserStatus;
  temple?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  mobile: string;
  templeId?: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
}

export interface SignupResponse {
  message: string;
  requiresApproval: boolean;
}
