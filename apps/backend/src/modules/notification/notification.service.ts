import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { User, UserDocument, UserRole } from '../user/schemas/user.schema';
import {
  NotificationTemplateKey,
  NOTIFICATION_TEMPLATES,
} from './notification-templates';
import { SubscribePushDto } from './dto/subscribe-push.dto';

export interface SendTemplateNotificationOptions {
  recipientId?: string;
  recipientRole?: string;
  senderId?: string;
  data: Record<string, any>;
  sendPush?: boolean;
}

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const subject =
      this.configService.get<string>('VAPID_SUBJECT') ||
      'mailto:admin@samanvaya.com';

    if (publicKey && privateKey) {
      webpush.setVapidDetails(subject, publicKey, privateKey);
      this.logger.log('✅ Web Push VAPID initialized successfully');
    } else {
      this.logger.warn('⚠️ Web Push VAPID keys not configured');
    }
  }

  getVapidPublicKey(): string {
    return this.configService.get<string>('VAPID_PUBLIC_KEY') || '';
  }

  /**
   * Register or update a browser push subscription for a user
   */
  async registerSubscription(
    userId: string,
    dto: SubscribePushDto,
  ): Promise<void> {
    try {
      const uId = new Types.ObjectId(userId);
      // Remove this browser endpoint from ANY user (in case another user was logged into this browser previously)
      await this.userModel.updateMany(
        { 'pushSubscriptions.endpoint': dto.endpoint },
        {
          $pull: {
            pushSubscriptions: { endpoint: dto.endpoint },
          },
        },
      );

      // Add the fresh subscription
      await this.userModel.updateOne(
        { _id: uId },
        {
          $push: {
            pushSubscriptions: {
              endpoint: dto.endpoint,
              keys: dto.keys,
              userAgent: dto.userAgent,
              createdAt: new Date(),
            },
          },
        },
      );

      this.logger.log(`📱 Push subscription registered for user: ${userId}`);
    } catch (err: any) {
      this.logger.error(
        `Failed to register push subscription: ${err.message}`,
      );
    }
  }

  /**
   * Remove a push subscription (e.g. on logout)
   */
  async removeSubscription(userId: string, endpoint: string): Promise<void> {
    try {
      const uId = new Types.ObjectId(userId);
      await this.userModel.updateOne(
        { _id: uId },
        {
          $pull: {
            pushSubscriptions: { endpoint },
          },
        },
      );
      this.logger.log(`📱 Push subscription removed for user: ${userId}`);
    } catch (err: any) {
      this.logger.error(`Failed to remove push subscription: ${err.message}`);
    }
  }

  /**
   * Centralized method to send notifications from templates
   */
  async sendFromTemplate(
    templateKey: NotificationTemplateKey,
    options: SendTemplateNotificationOptions,
  ): Promise<void> {
    const templateFactory = NOTIFICATION_TEMPLATES[templateKey];
    if (!templateFactory) {
      this.logger.error(`Notification template not found: ${templateKey}`);
      return;
    }

    const template = templateFactory(options.data);
    const targetRole = options.recipientRole || template.defaultRecipientRole;

    // 1. Identify recipient users
    let recipientUsers: UserDocument[] = [];
    if (options.recipientId) {
      const user = await this.userModel.findById(options.recipientId).exec();
      if (user) recipientUsers = [user];
    } else if (targetRole) {
      if (
        targetRole === UserRole.SUPER_ADMIN ||
        targetRole === 'Super Admin'
      ) {
        // Find all Super Admins
        recipientUsers = await this.userModel
          .find({
            role: {
              $in: [
                UserRole.SUPER_ADMIN,
                UserRole.SUPER_ADMINISTRATOR,
                'Super Admin',
                'Super Administrator',
              ],
            },
            status: 'APPROVED',
          })
          .exec();
      } else {
        recipientUsers = await this.userModel
          .find({ role: targetRole, status: 'APPROVED' })
          .exec();
      }
    }

    if (recipientUsers.length === 0) {
      this.logger.warn(`No recipients found for notification ${templateKey}`);
      return;
    }

    this.logger.log(
      `🔔 [Notification] Dispatching [${templateKey}] to ${recipientUsers.length} user(s): ${recipientUsers.map((u) => u.email).join(', ')}`,
    );

    const sendPush = options.sendPush !== false;
    const senderObjectId = options.senderId
      ? new Types.ObjectId(options.senderId)
      : undefined;

    // 2. Process for each recipient
    for (const recipient of recipientUsers) {
      try {
        // Save in-app notification in DB
        await this.notificationModel.create({
          recipient: recipient._id as any,
          sender: senderObjectId as any,
          title: template.title,
          body: template.body,
          type: template.type,
          actionUrl: template.actionUrl,
          metadata: options.data,
          isRead: false,
        });
        this.logger.log(`📥 [Notification] In-app notification saved for: ${recipient.email}`);

        // Send Web Push notification if enabled and subscriptions exist
        if (
          sendPush &&
          recipient.pushSubscriptions &&
          recipient.pushSubscriptions.length > 0
        ) {
          // Deduplicate subscriptions by endpoint
          const uniqueSubs = Array.from(
            new Map(
              recipient.pushSubscriptions.map((s) => [s.endpoint, s]),
            ).values(),
          );

          const pushPayload = JSON.stringify({
            id: 'notif-' + Date.now(),
            title: template.title,
            body: template.body,
            icon: template.icon || '/assets/04_lotus_icon_gold.png',
            badge: '/assets/04_lotus_icon_gold.png',
            actionUrl: template.actionUrl,
            data: {
              actionUrl: template.actionUrl,
              ...options.data,
            },
          });

          this.logger.log(
            `🚀 [Notification] Sending Web Push to ${uniqueSubs.length} unique device(s) for ${recipient.email}...`,
          );

          // Dispatch to unique device subscriptions for this user
          for (const sub of uniqueSubs) {
            try {
              await webpush.sendNotification(
                {
                  endpoint: sub.endpoint,
                  keys: sub.keys,
                },
                pushPayload,
              );
              this.logger.log(`✅ [Notification] Push delivered successfully to: ${recipient.email}`);
            } catch (pushErr: any) {
              // If subscription has expired or is invalid (410 Gone / 404 Not Found), remove it
              if (
                pushErr.statusCode === 410 ||
                pushErr.statusCode === 404
              ) {
                this.logger.warn(
                  `Expired push subscription cleaned up for user ${recipient._id}`,
                );
                await this.removeSubscription(
                  (recipient._id as any).toString(),
                  sub.endpoint,
                );
              } else {
                this.logger.error(
                  `Push dispatch error for user ${recipient._id}: ${pushErr.message}`,
                );
              }
            }
          }
        }
      } catch (err: any) {
        this.logger.error(
          `Failed to process notification for user ${recipient._id}: ${err.message}`,
        );
      }
    }
  }

  /**
   * Get paginated notifications for a user with unread count
   */
  async getUserNotifications(
    userId: string,
    limit: number = 20,
    page: number = 1,
  ): Promise<{
    notifications: any[];
    unreadCount: number;
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const recipientId = new Types.ObjectId(userId);

    const [notifications, unreadCount, total] = await Promise.all([
      this.notificationModel
        .find({ recipient: recipientId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sender', 'name avatar email')
        .exec(),
      this.notificationModel.countDocuments({
        recipient: recipientId,
        isRead: false,
      }),
      this.notificationModel.countDocuments({ recipient: recipientId }),
    ]);

    return { notifications, unreadCount, total };
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(
    userId: string,
    notificationId: string,
  ): Promise<any> {
    return this.notificationModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(notificationId),
          recipient: new Types.ObjectId(userId),
        },
        { isRead: true, readAt: new Date() },
        { new: true },
      )
      .exec();
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { recipient: new Types.ObjectId(userId), isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }
}
