import * as dns from 'node:dns';
// Resolve MongoDB Atlas SRV records reliably on Windows
dns.setServers(['8.8.8.8', '1.1.1.1']);

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend requests
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global API Prefix
  app.setGlobalPrefix('api');

  // Global Validation Pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  const port = process.env.PORT ?? 3005;
  await app.listen(port);
  console.log(`🚀 LDMS Backend Server running at: http://localhost:${port}/api`);
}

bootstrap();
