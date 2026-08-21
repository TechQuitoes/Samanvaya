import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class PushKeysDto {
  @IsNotEmpty()
  @IsString()
  p256dh: string;

  @IsNotEmpty()
  @IsString()
  auth: string;
}

export class SubscribePushDto {
  @IsNotEmpty()
  @IsString()
  endpoint: string;

  @IsNotEmpty()
  @IsObject()
  keys: PushKeysDto;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class UnsubscribePushDto {
  @IsNotEmpty()
  @IsString()
  endpoint: string;
}
