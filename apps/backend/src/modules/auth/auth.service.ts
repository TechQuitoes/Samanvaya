import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole, UserStatus } from '../user/schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.userModel.findOne({
      email: signupDto.email.toLowerCase(),
    });

    if (existingUser) {
      throw new ConflictException('An account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(signupDto.password, salt);

    const newUser = new this.userModel({
      name: signupDto.name,
      email: signupDto.email.toLowerCase(),
      password: hashedPassword,
      mobile: signupDto.mobile,
      temple: signupDto.templeId ? signupDto.templeId : undefined,
      role: signupDto.role || UserRole.VIEWER,
      status: UserStatus.PENDING_APPROVAL,
    });

    await newUser.save();

    return {
      message: 'Account created successfully!',
      requiresApproval: true,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: loginDto.email.toLowerCase() })
      .select('+password')
      .populate('temple')
      .exec();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Admin Approval Gate: block non-approved users
    if (user.status === UserStatus.PENDING_APPROVAL) {
      throw new ForbiddenException(
        'Your account is pending admin approval. Please wait for an administrator to verify your account.',
      );
    }
    if (user.status === UserStatus.REJECTED) {
      throw new ForbiddenException(
        'Your account request has been rejected. Please contact an administrator.',
      );
    }

    const userObj = user.toObject();
    delete (userObj as any).password;

    const accessToken = this.generateJwtToken(userObj);

    return {
      message: 'Login successful!',
      user: userObj,
      accessToken,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).populate('temple').exec();
    if (!user) {
      throw new NotFoundException('User profile not found.');
    }
    const userObj = user.toObject();
    delete (userObj as any).password;
    return userObj;
  }

  private generateJwtToken(user: any): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
