import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaderProfile, LeaderProfileSchema } from './schemas/leader-profile.schema';
import { LeaderProfileService } from './leader-profile.service';
import { LeaderProfileController } from './leader-profile.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeaderProfile.name, schema: LeaderProfileSchema },
    ]),
  ],
  controllers: [LeaderProfileController],
  providers: [LeaderProfileService],
  exports: [LeaderProfileService],
})
export class LeaderProfileModule {}
