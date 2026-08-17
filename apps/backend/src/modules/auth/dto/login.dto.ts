import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Invalid email address format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}
