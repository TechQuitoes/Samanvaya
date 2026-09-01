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
    this.region =
      this.configService.get<string>('AWS_REGION') ||
      this.configService.get<string>('R2_REGION') ||
      'auto';

    this.bucket =
      this.configService.get<string>('CLOUDFLARE_R2_BUCKET') ||
      this.configService.get<string>('R2_BUCKET') ||
      this.configService.get<string>('AWS_S3_BUCKET') ||
      'samanvaya-media';

    this.customDomain =
      this.configService.get<string>('CLOUDFLARE_R2_PUBLIC_URL') ||
      this.configService.get<string>('R2_PUBLIC_URL') ||
      this.configService.get<string>('AWS_S3_CUSTOM_DOMAIN') ||
      this.configService.get<string>('PUBLIC_CDN_URL');

    const accessKeyId =
      this.configService.get<string>('CLOUDFLARE_R2_ACCESS_KEY_ID') ||
      this.configService.get<string>('R2_ACCESS_KEY_ID') ||
      this.configService.get<string>('AWS_ACCESS_KEY_ID');

    const secretAccessKey =
      this.configService.get<string>('CLOUDFLARE_R2_SECRET_ACCESS_KEY') ||
      this.configService.get<string>('R2_SECRET_ACCESS_KEY') ||
      this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    const endpoint =
      this.configService.get<string>('CLOUDFLARE_R2_ENDPOINT') ||
      this.configService.get<string>('R2_ENDPOINT') ||
      this.configService.get<string>('AWS_ENDPOINT');

    if (accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region: this.region,
        endpoint: endpoint || undefined,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.logger.log(`✅ S3/R2 Storage Client initialized (Bucket: ${this.bucket}, Endpoint: ${endpoint || 'AWS Standard'})`);
    } else {
      this.s3Client = new S3Client({
        region: this.region,
        endpoint: endpoint || undefined,
      });
      this.logger.warn('⚠️ S3/R2 credentials not set in .env. Storage calls will use default credentials.');
    }
  }

  /**
   * Generates a PUT presigned URL for direct secure client upload
   */
  async generatePresignedUrl(
    userId: string,
    dto: GeneratePresignedUrlDto,
  ): Promise<GeneratePresignedUrlResponseDto> {
    const rawFolder = (dto.folder || 'avatars').replace(/^\/+|\/+$/g, '');
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
    const publicUrl = this.getPublicUrl(key);

    this.logger.log(`Generated S3/R2 presigned URL for key: ${key}`);

    return {
      presignedUrl,
      key,
      publicUrl,
      fileType: dto.fileType,
    };
  }

  /**
   * Directly uploads a file buffer to S3 / Cloudflare R2 from the server
   */
  async uploadDirect(
    userId: string,
    file: { buffer: Buffer; originalname: string; mimetype: string },
    folder: string = 'avatars',
  ): Promise<{ key: string; publicUrl: string; fileType: string }> {
    const rawFolder = (folder || 'avatars').replace(/^\/+|\/+$/g, '');
    const cleanFileName = (file.originalname || 'file.jpg')
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '_')
      .replace(/_+/g, '_');
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const key = `${rawFolder}/${userId.substring(0, 8)}_${timestamp}_${randomSuffix}_${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    const publicUrl = this.getPublicUrl(key);

    this.logger.log(`✅ Uploaded direct S3/R2 object for key: ${key}`);

    return {
      key,
      publicUrl,
      fileType: file.mimetype,
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
    if (this.customDomain) {
      const domain = this.customDomain.replace(/\/+$/, '');
      const cleanKey = key.replace(/^\/+/, '');
      return `${domain}/${cleanKey}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
