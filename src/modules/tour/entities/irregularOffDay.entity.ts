import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tour } from './tour.entity';

@Entity({ name: 'IRREGULAR_OFF_DAY' })
export class IrregularOffDay {
  constructor(irregularOffDayUid: number) {
    this.irregularOffDayUid = irregularOffDayUid;
  }
  @PrimaryGeneratedColumn({ name: 'irregular_off_day_uid' })
  irregularOffDayUid: number;

  @Column({ name: 'date', type: 'date' })
  date: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Tour)
  @JoinColumn({ name: 'tour_uid' })
  @Column({ name: 'tour_uid' })
  tour: Tour;
}
