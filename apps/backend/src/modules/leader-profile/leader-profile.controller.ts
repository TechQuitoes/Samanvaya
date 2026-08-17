import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { LeaderProfileService } from './leader-profile.service';
import { UpdateLeaderLocationDto, UpdateLeaderProfileDto } from './dto/update-leader-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('leader-profile')
@UseGuards(JwtAuthGuard)
export class LeaderProfileController {
  constructor(private readonly leaderProfileService: LeaderProfileService) {}

  @Get()
  async getMyProfile(@Request() req: any) {
    return this.leaderProfileService.getProfileByUserId(req.user.userId);
  }

  @Patch()
  async updateMyProfile(
    @Request() req: any,
    @Body() updateDto: UpdateLeaderProfileDto,
  ) {
    return this.leaderProfileService.updateProfile(req.user.userId, updateDto);
  }

  @Patch('location-status')
  async updateLocationAndStatus(
    @Request() req: any,
    @Body() locationDto: UpdateLeaderLocationDto,
  ) {
    return this.leaderProfileService.updateLocationAndStatus(
      req.user.userId,
      locationDto,
    );
  }
}
