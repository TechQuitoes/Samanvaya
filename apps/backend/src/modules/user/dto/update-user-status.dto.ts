import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../schemas/user.schema';

export class UpdateUserStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum([UserStatus.APPROVED, UserStatus.REJECTED], {
    message: 'Status must be either APPROVED or REJECTED',
  })
  status: UserStatus;
}
