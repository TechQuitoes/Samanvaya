export enum TaskModuleType {
  GENERAL = 'GENERAL',
  TRAVEL = 'TRAVEL',
  MEETING = 'MEETING',
  EVENT = 'EVENT',
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
  CANCELLED = 'CANCELLED',
}

export interface TaskComment {
  author: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  authorName?: string;
  commentText: string;
  createdAt: string;
}

export interface TaskAttachment {
  name: string;
  url: string;
  fileType?: string;
  uploadedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  moduleType: TaskModuleType;
  moduleRefId?: string;
  moduleTitle?: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
    mobile?: string;
    spiritualName?: string;
    initiatedName?: string;
    avatar?: string;
  };
  assignedBy: {
    _id: string;
    name: string;
    email: string;
    spiritualName?: string;
    initiatedName?: string;
  };
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  completedAt?: string;
  comments: TaskComment[];
  attachments: TaskAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  moduleType?: TaskModuleType;
  moduleRefId?: string;
  moduleTitle?: string;
  assignedTo: string; // User _id
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  attachments?: { name: string; url: string; fileType?: string }[];
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  assignedTo?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
}
