import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LeaderStatus } from '../schemas/leader-profile.schema';

export class EmergencyContactDto {
  @IsString()
  name: string;

  @IsString()
  relation: string;

  @IsString()
  phone: string;
}

export class OfficialDocumentDto {
  @IsString()
  title: string;

  @IsString()
  fileUrl: string;
}

export class UpdateLeaderProfileDto {
  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDto)
  emergencyContacts?: EmergencyContactDto[];

  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfficialDocumentDto)
  officialDocuments?: OfficialDocumentDto[];

  @IsOptional()
  @IsString()
  residenceAddress?: string;
}

export class UpdateLeaderLocationDto {
  @IsEnum(LeaderStatus)
  currentStatus: LeaderStatus;

  @IsString()
  currentCity: string;

  @IsOptional()
  @IsString()
  currentTempleId?: string;

  @IsOptional()
  @IsString()
  residenceAddress?: string;
}
