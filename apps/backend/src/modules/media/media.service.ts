import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GeneratePresignedUrlDto, GeneratePresignedUrlResponseDto } from './dto/generate-presigned-url.dto';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly customDomain?: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION') || 'ap-south-1';
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET') || 'samanvaya-media-bucket';
    this.customDomain = this.configService.get<string>('AWS_S3_CUSTOM_DOMAIN');

    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.logger.log('✅ AWS S3 Client initialized with configured credentials');
    } else {
      this.s3Client = new S3Client({
        region: this.region,
      });
      this.logger.warn('⚠️ AWS S3 credentials not set in .env. S3 calls will use default AWS credential chain.');
    }
  }

  /**
   * Generates a PUT presigned URL for direct secure client upload
   */
  async generatePresignedUrl(
    userId: string,
    dto: GeneratePresignedUrlDto,
  ): Promise<GeneratePresignedUrlResponseDto> {
    const rawFolder = (dto.folder || 'uploads').replace(/^\/+|\/+$/g, '');
    const cleanFileName = dto.fileName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '_')
      .replace(/_+/g, '_');
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);

    // Clean Key structure: e.g. avatars/6a833fb7_1740000000_a1b2c3_avatar.jpg
    const key = `${rawFolder}/${userId.substring(0, 8)}_${timestamp}_${randomSuffix}_${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: dto.fileType,
    });

    // 15-minute expiry for client upload window
    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 900,
    });

    // Public URL format
    const publicUrl = this.customDomain
      ? `https://${this.customDomain}/${key}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

    this.logger.log(`Generated S3 presigned URL for key: ${key}`);

    return {
      presignedUrl,
      key,
      publicUrl,
      fileType: dto.fileType,
    };
  }

  /**
   * Helper to construct public URL from a stored key
   */
  getPublicUrl(key: string): string {
    if (!key) return '';
    if (key.startsWith('http://') || key.startsWith('https://')) {
      return key;
    }
    return this.customDomain
      ? `https://${this.customDomain}/${key}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
