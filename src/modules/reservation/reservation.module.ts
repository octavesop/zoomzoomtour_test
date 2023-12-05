import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisConnectionProvider } from 'src/loaders/redis.loader';
import { ReservationController } from './controllers/reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { ReservationService } from './services/reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation])],
  controllers: [ReservationController],
  providers: [ReservationService, RedisConnectionProvider],
  exports: [ReservationService],
})
export class ReservationModule {}
