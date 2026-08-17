import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsOptional()
  @IsString()
  templeId?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
