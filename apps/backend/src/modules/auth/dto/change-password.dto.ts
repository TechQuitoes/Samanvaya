import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'New password is required.' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  newPassword: string;

  @IsNotEmpty({ message: 'Confirm password is required.' })
  @IsString()
  confirmPassword: string;
}
