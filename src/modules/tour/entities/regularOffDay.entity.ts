import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tour } from './tour.entity';

@Entity({ name: 'REGULAR_OFF_DAY' })
export class RegularOffDay {
  constructor(regularOffDayUid: number) {
    this.regularOffDayUid = regularOffDayUid;
  }
  @PrimaryGeneratedColumn({ name: 'regular_off_day_uid' })
  regularOffDayUid: number;

  @Column({ name: 'monday', default: false })
  monday: boolean;

  @Column({ name: 'tuesday', default: false })
  tuesday: boolean;

  @Column({ name: 'wednesday', default: false })
  wednesday: boolean;

  @Column({ name: 'thursday', default: false })
  thursday: boolean;

  @Column({ name: 'friday', default: false })
  friday: boolean;

  @Column({ name: 'saturday', default: false })
  saturday: boolean;

  @Column({ name: 'sunday' })
  sunday: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Tour)
  @JoinColumn({ name: 'tour_uid' })
  @Column({ name: 'tour_uid' })
  tour: Tour;
}
