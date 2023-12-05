import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReservationStatus } from '../consts/reservationStatus.enum';

@Entity({ name: 'RESERVATION' })
export class Reservation {
  constructor(reservationUid: number) {
    this.reservationUid = reservationUid;
  }
  @PrimaryGeneratedColumn({ name: 'reservation_uid' })
  reservationUid: number;

  @Column({ name: 'reservation_uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({
    type: 'enum',
    name: 'reservation_status',
    enum: ReservationStatus,
    default: ReservationStatus.WAIT,
  })
  status: ReservationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', default: null })
  deletedAt: Date;
}
