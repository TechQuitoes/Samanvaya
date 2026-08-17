import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LeaderProfile, LeaderProfileDocument } from './schemas/leader-profile.schema';
import { UpdateLeaderLocationDto, UpdateLeaderProfileDto } from './dto/update-leader-profile.dto';

@Injectable()
export class LeaderProfileService {
  constructor(
    @InjectModel(LeaderProfile.name)
    private readonly leaderProfileModel: Model<LeaderProfileDocument>,
  ) {}

  async getProfileByUserId(userId: string): Promise<LeaderProfileDocument> {
    let profile = await this.leaderProfileModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'name email mobile role')
      .populate('currentTempleId', 'name city state')
      .exec();

    // Auto-create empty profile if not exists
    if (!profile) {
      profile = await this.leaderProfileModel.create({
        userId: new Types.ObjectId(userId),
        currentCity: 'Mumbai',
        residenceAddress: 'ISKCON Juhu, Mumbai',
      });
      profile = await profile.populate([
        { path: 'userId', select: 'name email mobile role' },
        { path: 'currentTempleId', select: 'name city state' },
      ]);
    }

    return profile;
  }

  async updateProfile(
    userId: string,
    updateDto: UpdateLeaderProfileDto,
  ): Promise<LeaderProfileDocument> {
    let profile = await this.leaderProfileModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!profile) {
      profile = new this.leaderProfileModel({
        userId: new Types.ObjectId(userId),
      });
    }

    Object.assign(profile, updateDto);
    if (updateDto.dob) {
      profile.dob = new Date(updateDto.dob);
    }

    await profile.save();
    return this.getProfileByUserId(userId);
  }

  async updateLocationAndStatus(
    userId: string,
    locationDto: UpdateLeaderLocationDto,
  ): Promise<LeaderProfileDocument> {
    let profile = await this.leaderProfileModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!profile) {
      profile = new this.leaderProfileModel({
        userId: new Types.ObjectId(userId),
      });
    }

    profile.currentStatus = locationDto.currentStatus;
    profile.currentCity = locationDto.currentCity;
    profile.lastUpdatedLocAt = new Date();

    if (locationDto.currentTempleId) {
      profile.currentTempleId = new Types.ObjectId(locationDto.currentTempleId) as any;
    }
    if (locationDto.residenceAddress) {
      profile.residenceAddress = locationDto.residenceAddress;
    }

    await profile.save();
    return this.getProfileByUserId(userId);
  }
}
