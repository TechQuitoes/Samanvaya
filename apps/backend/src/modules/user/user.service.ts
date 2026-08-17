import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserStatus } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email.toLowerCase(),
    });

    if (existingUser) {
      throw new ConflictException('An account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const createdUser = new this.userModel({
      name: createUserDto.name,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      mobile: createUserDto.mobile,
      temple: createUserDto.templeId ? createUserDto.templeId : undefined,
      role: createUserDto.role,
    });

    const savedUser = await createdUser.save();
    const userObj = savedUser.toObject();
    delete (userObj as any).password;
    return userObj;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('temple')
      .exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).populate('temple').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('temple').exec();
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    return this.userModel.find({ status }).populate('temple').sort({ createdAt: -1 }).exec();
  }

  async updateStatus(userId: string, status: UserStatus): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status = status;
    const updatedUser = await user.save();
    const populated = await updatedUser.populate('temple');
    const userObj = populated.toObject();
    delete (userObj as any).password;
    return userObj;
  }
}
