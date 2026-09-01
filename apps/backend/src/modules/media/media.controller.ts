import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MediaService } from './media.service';
import {
  GeneratePresignedUrlDto,
  GeneratePresignedUrlResponseDto,
} from './dto/generate-presigned-url.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('presigned-url')
  async getPresignedUrl(
    @Request() req: any,
    @Body() dto: GeneratePresignedUrlDto,
  ): Promise<GeneratePresignedUrlResponseDto> {
    const userId = req.user.userId || req.user.sub || req.user._id || req.user.id || 'anonymous';
    return this.mediaService.generatePresignedUrl(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req: any,
    @UploadedFile() file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required for upload.');
    }
    const userId = req.user.userId || req.user.sub || req.user._id || req.user.id || 'anonymous';
    return this.mediaService.uploadDirect(userId, file, folder);
  }
}
