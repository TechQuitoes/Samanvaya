import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GeneratePresignedUrlDto {
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  fileType: string;

  @IsOptional()
  @IsString()
  folder?: string;
}

export class GeneratePresignedUrlResponseDto {
  presignedUrl: string;
  key: string;
  publicUrl: string;
  fileType: string;
}
