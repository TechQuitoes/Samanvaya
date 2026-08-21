import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
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
}
