import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class GoogleAuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('google')
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    return this.authService.handleGoogleAuth(googleAuthDto.credential);
  }
}
