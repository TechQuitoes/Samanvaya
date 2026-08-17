import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../user/schemas/user.schema';

export class SignupDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Invalid email address format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Mobile number is required' })
  @IsString()
  mobile: string;

  @IsOptional()
  @IsString()
  templeId?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid user role selected' })
  role?: UserRole;
}
