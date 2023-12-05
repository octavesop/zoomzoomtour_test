import { Module } from '@nestjs/common';
import { TourController } from './controllers/tour.controller';
import { TourService } from './services/tour.service';

@Module({
  imports: [],
  controllers: [TourController],
  providers: [TourService],
  exports: [],
})
export class TourModule {}
