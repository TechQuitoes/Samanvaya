import { IsEnum, IsNotEmpty, IsOptional, IsObject, IsString } from 'class-validator';
import { UserStatus } from '../schemas/user.schema';

export class UpdateUserStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(
    [
      UserStatus.APPROVED,
      UserStatus.REJECTED,
      UserStatus.BLOCKED,
      UserStatus.PENDING_APPROVAL,
    ],
    {
      message: 'Status must be either APPROVED, REJECTED, BLOCKED, or PENDING_APPROVAL',
    },
  )
  status: UserStatus;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsObject()
  permissions?: Record<string, Record<string, boolean>>;
}
