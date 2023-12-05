import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    @Inject('RedisConnectionProvider')
    private readonly RedisConnectionProvider,
  ) {}

  async fetchMyReservationList(): Promise<Reservation[]> {
    throw new Error('Method not implemented.');
  }

  async fetchMySellerReservationList(): Promise<Reservation[]> {
    throw new Error('Method not implemented.');
  }
}
