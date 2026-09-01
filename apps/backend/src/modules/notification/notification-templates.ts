import { NotificationType } from './schemas/notification.schema';
import { UserRole } from '../user/schemas/user.schema';

export enum NotificationTemplateKey {
  NEW_REGISTRATION_REQUEST = 'NEW_REGISTRATION_REQUEST',
  ACCOUNT_APPROVED = 'ACCOUNT_APPROVED',
  ACCOUNT_BLOCKED = 'ACCOUNT_BLOCKED',
  ACCOUNT_REJECTED = 'ACCOUNT_REJECTED',
  TRAVEL_PLAN_CREATED = 'TRAVEL_PLAN_CREATED',
  TRAVEL_PLAN_SUBMITTED = 'TRAVEL_PLAN_SUBMITTED',
  TRAVEL_PLAN_APPROVED = 'TRAVEL_PLAN_APPROVED',
  TRAVEL_PLAN_REJECTED = 'TRAVEL_PLAN_REJECTED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_COMMENT_ADDED = 'TASK_COMMENT_ADDED',
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
    icon: '/assets/04_lotus_icon_gold.png',
  }),

  [NotificationTemplateKey.ACCOUNT_BLOCKED]: (data) => ({
    title: 'Account Status Update 🛑',
    body: `Hare Krishna ${data.userName || 'User'}, your account has been temporarily suspended. Please contact your coordinator.`,
    type: NotificationType.ACCOUNT_BLOCKED,
    actionUrl: '/login',
    icon: '/assets/04_lotus_icon_gold.png',
  }),

  [NotificationTemplateKey.ACCOUNT_REJECTED]: (data) => ({
    title: 'Registration Request Update',
    body: `Hare Krishna ${data.userName || 'User'}, your registration request has been reviewed.`,
    type: NotificationType.ACCOUNT_REJECTED,
    actionUrl: '/login',
    icon: '/assets/04_lotus_icon_gold.png',
  }),

  [NotificationTemplateKey.TRAVEL_PLAN_CREATED]: (data) => ({
    title: 'New Travel Plan Scheduled ✈️',
    body: `Travel plan to ${data.destination || 'destination'} has been created for ${data.leaderName || 'Leader'}.`,
    type: NotificationType.TRAVEL,
    actionUrl: `/travel`,
    icon: '/assets/04_lotus_icon_gold.png',
  }),

  [NotificationTemplateKey.TRAVEL_PLAN_SUBMITTED]: (data) => ({
    title: 'New Travel Plan Submitted 🧳',
    body: `${data.devoteeName || 'A devotee'} submitted a new travel plan for "${data.title || 'Itinerary'}" (${data.fromLocation || ''} → ${data.destinationCity || ''}). Click to review.`,
    type: NotificationType.TRAVEL,
    actionUrl: '/travel',
    defaultRecipientRole: UserRole.SUPER_ADMIN,
    icon: '/assets/04_lotus_icon_gold.png',
  }),

  [NotificationTemplateKey.TRAVEL_PLAN_APPROVED]: (data) => ({
    title: 'Travel Plan Approved! ✨',
    body: `Hare Krishna ${data.devoteeName || 'Devotee'}! Your travel plan "${data.title || 'Itinerary'}" to ${data.destinationCity || ''} has been approved.${data.remarks ? ' Remarks: ' + data.remarks : ''}`,
    type: NotificationType.TRAVEL,
    actionUrl: '/travel',
    icon: '/assets/04_lotus_icon_gold.png',
  }),

  [NotificationTemplateKey.TRAVEL_PLAN_REJECTED]: (data) => ({
    title: 'Travel Plan Status Update ⚠️',
    body: `Hare Krishna ${data.devoteeName || 'Devotee'}, your travel plan "${data.title || 'Itinerary'}" has been rejected.${data.remarks ? ' Reason: ' + data.remarks : ''}`,
    type: NotificationType.TRAVEL,
    actionUrl: '/travel',
    icon: '/assets/04_lotus_icon_gold.png',
  }),

  [NotificationTemplateKey.TASK_ASSIGNED]: (data) => ({
    title: 'New Seva Task Assigned 📋',
    body: `Hare Krishna ${data.assigneeName || 'Devotee'}! You have been assigned a new task: "${data.title}"${data.moduleTitle ? ' for ' + data.moduleTitle : ''}.${data.dueDate ? ' Due: ' + data.dueDate : ''}`,
    type: NotificationType.TASK,
    actionUrl: '/tasks',
    icon: '/assets/04_lotus_icon_gold.png',
  }),

  [NotificationTemplateKey.TASK_COMPLETED]: (data) => ({
    title: 'Seva Task Completed! ✅',
    body: `Hare Krishna! ${data.assigneeName || 'Devotee'} has completed the task: "${data.title}"${data.moduleTitle ? ' for ' + data.moduleTitle : ''}.`,
    type: NotificationType.TASK,
    actionUrl: '/tasks',
    icon: '/assets/04_lotus_icon_gold.png',
  }),

  [NotificationTemplateKey.TASK_COMMENT_ADDED]: (data) => ({
    title: 'New Update on Task 💬',
    body: `${data.authorName || 'Devotee'} added a comment on task "${data.title}": "${data.commentText}"`,
    type: NotificationType.TASK,
    actionUrl: '/tasks',
    icon: '/assets/04_lotus_icon_gold.png',
  }),
};
