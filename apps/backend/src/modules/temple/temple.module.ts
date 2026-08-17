import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Temple, TempleSchema } from './schemas/temple.schema';
import { TempleService } from './temple.service';
import { TempleController } from './temple.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Temple.name, schema: TempleSchema }]),
  ],
  controllers: [TempleController],
  providers: [TempleService],
  exports: [TempleService, MongooseModule],
})
export class TempleModule {}
