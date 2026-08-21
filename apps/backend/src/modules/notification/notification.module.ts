import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ConfigModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
