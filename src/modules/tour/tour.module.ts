import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerModule } from '../seller/seller.module';
import { TourController } from './controllers/tour.controller';
import { RegularOffDay } from './entities/regularOffDay.entity';
import { Tour } from './entities/tour.entity';
import { TourService } from './services/tour.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tour, RegularOffDay]), SellerModule],
  controllers: [TourController],
  providers: [TourService],
  exports: [TourService],
})
export class TourModule {}
