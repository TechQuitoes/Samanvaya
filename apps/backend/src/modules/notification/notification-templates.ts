import { NotificationType } from './schemas/notification.schema';
import { UserRole } from '../user/schemas/user.schema';

export enum NotificationTemplateKey {
  NEW_REGISTRATION_REQUEST = 'NEW_REGISTRATION_REQUEST',
  ACCOUNT_APPROVED = 'ACCOUNT_APPROVED',
  ACCOUNT_BLOCKED = 'ACCOUNT_BLOCKED',
  ACCOUNT_REJECTED = 'ACCOUNT_REJECTED',
  TRAVEL_PLAN_CREATED = 'TRAVEL_PLAN_CREATED',
}

export interface NotificationTemplateDefinition {
  title: string;
  body: string;
  type: NotificationType;
  actionUrl: string;
  defaultRecipientRole?: string;
  icon?: string;
}

export const NOTIFICATION_TEMPLATES: Record<
  NotificationTemplateKey,
  (data: Record<string, any>) => NotificationTemplateDefinition
> = {
  [NotificationTemplateKey.NEW_REGISTRATION_REQUEST]: (data) => ({
    title: 'New Account Approval Request 🔔',
    body: `${data.applicantName || 'A new user'} (${data.applicantEmail || ''}) has applied for community access. Click to review and assign permissions.`,
    type: NotificationType.APPROVAL_REQUEST,
    actionUrl: '/admin/approvals?tab=pending',
    defaultRecipientRole: UserRole.SUPER_ADMIN,
    icon: '/assets/04_lotus_icon_gold.png',
  }),

  [NotificationTemplateKey.ACCOUNT_APPROVED]: (data) => ({
    title: 'Account Approved! ✨',
    body: `Hare Krishna ${data.userName || 'Devotee'}! Your account has been verified and approved as ${data.role || 'Member'}. Welcome to Samanvaya!`,
    type: NotificationType.ACCOUNT_APPROVED,
    actionUrl: '/dashboard',
    icon: '/assests/lotus-small.png',
  }),

  [NotificationTemplateKey.ACCOUNT_BLOCKED]: (data) => ({
    title: 'Account Status Update 🛑',
    body: `Hare Krishna ${data.userName || 'User'}, your account has been temporarily suspended. Please contact your coordinator.`,
    type: NotificationType.ACCOUNT_BLOCKED,
    actionUrl: '/login',
    icon: '/assests/lotus-small.png',
  }),

  [NotificationTemplateKey.ACCOUNT_REJECTED]: (data) => ({
    title: 'Registration Request Update',
    body: `Hare Krishna ${data.userName || 'User'}, your registration request has been reviewed.`,
    type: NotificationType.ACCOUNT_REJECTED,
    actionUrl: '/login',
    icon: '/assests/lotus-small.png',
  }),

  [NotificationTemplateKey.TRAVEL_PLAN_CREATED]: (data) => ({
    title: 'New Travel Plan Scheduled ✈️',
    body: `Travel plan to ${data.destination || 'destination'} has been created for ${data.leaderName || 'Leader'}.`,
    type: NotificationType.TRAVEL,
    actionUrl: `/travel/${data.travelId || ''}`,
    icon: '/assests/lotus-small.png',
  }),
};
