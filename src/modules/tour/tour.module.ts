import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisConnectionProvider } from 'src/loaders/redis.loader';
import { SellerModule } from '../seller/seller.module';
import { TourController } from './controllers/tour.controller';
import { IrregularOffDay } from './entities/irregularOffDay.entity';
import { RegularOffDay } from './entities/regularOffDay.entity';
import { Tour } from './entities/tour.entity';
import { TourService } from './services/tour.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tour, RegularOffDay, IrregularOffDay]),
    SellerModule,
  ],
  controllers: [TourController],
  providers: [TourService, RedisConnectionProvider],
  exports: [TourService],
})
export class TourModule {}
