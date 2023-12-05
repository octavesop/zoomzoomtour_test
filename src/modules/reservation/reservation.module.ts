import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourModule } from '../tour/tour.module';
import { ReservationController } from './controllers/reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { ReservationService } from './services/reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), TourModule],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
