import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Travel, TravelSchema } from './schemas/travel.schema';
import { TravelTask, TravelTaskSchema } from './schemas/travel-task.schema';
import { TravelService } from './travel.service';
import { TravelController } from './travel.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Travel.name, schema: TravelSchema },
      { name: TravelTask.name, schema: TravelTaskSchema },
    ]),
  ],
  controllers: [TravelController],
  providers: [TravelService],
  exports: [TravelService],
})
export class TravelModule {}
