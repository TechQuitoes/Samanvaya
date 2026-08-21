import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole, UserStatus, AuthProvider } from '../user/schemas/user.schema';
import { NotificationService } from '../notification/notification.service';
import { NotificationTemplateKey } from '../notification/notification-templates';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

interface GoogleTokenPayload {
  sub: string;       // Google unique user ID
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
  ) {}

  async signup(signupDto: SignupDto) {
    const email = signupDto.email.toLowerCase().trim();
    const isAllowedDomain = email.endsWith('@samanvaya.com') || email.endsWith('@gmail.com');
    if (!isAllowedDomain) {
      throw new BadRequestException(
        'Registration is restricted. Only @samanvaya.com or @gmail.com email addresses are allowed.',
      );
    }

    const existingUser = await this.userModel.findOne({
      email,
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
      authProvider: AuthProvider.LOCAL,
    });

    await newUser.save();

    // Trigger Notification to Super Admins
    try {
      await this.notificationService.sendFromTemplate(
        NotificationTemplateKey.NEW_REGISTRATION_REQUEST,
        {
          senderId: newUser._id.toString(),
          data: {
            applicantName: newUser.name,
            applicantEmail: newUser.email,
            applicantId: newUser._id.toString(),
          },
        },
      );
    } catch {
      // Non-blocking notification dispatch
    }

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

    // If user signed up via Google, they can't use password login
    if (user.authProvider === AuthProvider.GOOGLE && !user.password) {
      throw new UnauthorizedException(
        'This account uses Google Sign-In. Please use "Continue with Google" to log in.',
      );
    }

    if (!user.password) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Admin Approval & Block Gate: block non-approved / blocked users
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
    if (user.status === UserStatus.BLOCKED) {
      throw new ForbiddenException(
        'Your account has been temporarily blocked. Please contact an administrator.',
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

  /**
   * Unified Google Auth Handler (Login + Auto-Registration)
   * - Verifies the Google ID token credential
   * - If user exists & approved: issue JWT (login)
   * - If user exists & pending/rejected: throw ForbiddenException
   * - If user does not exist: auto-create with PENDING_APPROVAL status
   */
  async handleGoogleAuth(credential: string) {
    // 1. Verify the Google ID token
    const googleUser = await this.verifyGoogleToken(credential);

    // 2. Validate allowed email domain (@samanvaya.com or @gmail.com)
    const email = googleUser.email.toLowerCase().trim();
    const isAllowedDomain = email.endsWith('@samanvaya.com') || email.endsWith('@gmail.com');
    if (!isAllowedDomain) {
      throw new BadRequestException(
        'Access restricted. Only @samanvaya.com or @gmail.com Google accounts are allowed.',
      );
    }

    // 3. Look up existing user by email
    const existingUser = await this.userModel
      .findOne({ email })
      .populate('temple')
      .exec();

    // 3a. User exists — check approval status
    if (existingUser) {
      // Update googleId and avatar if not already set
      if (!existingUser.googleId || !existingUser.avatar) {
        if (!existingUser.googleId) existingUser.googleId = googleUser.sub;
        if (!existingUser.avatar && googleUser.picture) existingUser.avatar = googleUser.picture;
        await existingUser.save();
      }

      if (existingUser.status === UserStatus.PENDING_APPROVAL) {
        throw new ForbiddenException(
          'Your account is pending admin approval. Please wait for an administrator to verify your account.',
        );
      }
      if (existingUser.status === UserStatus.REJECTED) {
        throw new ForbiddenException(
          'Your account request has been rejected. Please contact an administrator.',
        );
      }

      const userObj = existingUser.toObject();
      delete (userObj as any).password;
      const accessToken = this.generateJwtToken(userObj);

      return {
        message: 'Login successful!',
        user: userObj,
        accessToken,
      };
    }

    // 3b. User does not exist — auto-register with PENDING_APPROVAL
    const newUser = new this.userModel({
      name: googleUser.name,
      email: googleUser.email.toLowerCase(),
      googleId: googleUser.sub,
      avatar: googleUser.picture || undefined,
      authProvider: AuthProvider.GOOGLE,
      role: UserRole.VIEWER,
      status: UserStatus.PENDING_APPROVAL,
    });

    await newUser.save();

    // Trigger Notification to Super Admins
    try {
      await this.notificationService.sendFromTemplate(
        NotificationTemplateKey.NEW_REGISTRATION_REQUEST,
        {
          senderId: newUser._id.toString(),
          data: {
            applicantName: newUser.name,
            applicantEmail: newUser.email,
            applicantId: newUser._id.toString(),
          },
        },
      );
    } catch {
      // Non-blocking
    }

    return {
      message: 'Account created successfully! Your registration is pending admin approval.',
      requiresApproval: true,
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

  /**
   * Verify a Google ID token using Google's tokeninfo endpoint.
   * This avoids needing the `google-auth-library` dependency.
   */
  private async verifyGoogleToken(idToken: string): Promise<GoogleTokenPayload> {
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
      );

      if (!response.ok) {
        throw new UnauthorizedException('Invalid Google token. Please try again.');
      }

      const payload = await response.json();

      if (!payload.email || !payload.sub) {
        throw new UnauthorizedException('Google token missing required fields.');
      }

      if (payload.email_verified === 'false' || payload.email_verified === false) {
        throw new UnauthorizedException('Google email is not verified.');
      }

      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        picture: payload.picture,
        email_verified: true,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Failed to verify Google token. Please try again.');
    }
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

