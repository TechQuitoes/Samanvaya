import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import {
  SubscribePushDto,
  UnsubscribePushDto,
} from './dto/subscribe-push.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('vapid-public-key')
  getVapidPublicKey() {
    return {
      publicKey: this.notificationService.getVapidPublicKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getNotifications(
    @Request() req: any,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    const userId = req.user.sub || req.user._id || req.user.id;
    return this.notificationService.getUserNotifications(
      userId,
      limit ? Number(limit) : 20,
      page ? Number(page) : 1,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribePush(
    @Request() req: any,
    @Body() dto: SubscribePushDto,
  ) {
    const userId = req.user.sub || req.user._id || req.user.id;
    await this.notificationService.registerSubscription(userId, dto);
    return { message: 'Push subscription registered successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('unsubscribe')
  async unsubscribePush(
    @Request() req: any,
    @Body() dto: UnsubscribePushDto,
  ) {
    const userId = req.user.sub || req.user._id || req.user.id;
    await this.notificationService.removeSubscription(userId, dto.endpoint);
    return { message: 'Push subscription removed successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markRead(
    @Request() req: any,
    @Param('id') notificationId: string,
  ) {
    const userId = req.user.sub || req.user._id || req.user.id;
    return this.notificationService.markAsRead(userId, notificationId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('read-all')
  async markAllRead(@Request() req: any) {
    const userId = req.user.sub || req.user._id || req.user.id;
    await this.notificationService.markAllAsRead(userId);
    return { message: 'All notifications marked as read' };
  }
}
