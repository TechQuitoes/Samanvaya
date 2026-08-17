import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TempleModule } from './modules/temple/temple.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LeaderProfileModule } from './modules/leader-profile/leader-profile.module';
import { TravelModule } from './modules/travel/travel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://127.0.0.1:27017/ldms',
        family: 4,
        serverSelectionTimeoutMS: 10000,
      }),
      inject: [ConfigService],
    }),
    TempleModule,
    UserModule,
    AuthModule,
    LeaderProfileModule,
    TravelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
