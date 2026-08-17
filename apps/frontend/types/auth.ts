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
