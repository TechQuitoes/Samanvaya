export interface AppNotification {
  _id: string;
  recipient: string;
  sender?: {
    _id: string;
    name: string;
    avatar?: string;
    email?: string;
  };
  title: string;
  body: string;
  type: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
  total: number;
}
