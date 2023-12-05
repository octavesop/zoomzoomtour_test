import { Seller } from 'src/modules/seller/entities/seller.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'TOUR' })
export class Tour {
  constructor(tourUid: number) {
    this.tourUid = tourUid;
  }
  @PrimaryGeneratedColumn({ name: 'tour_uid' })
  tourUid: number;

  @Column({ name: 'tour_title' })
  tourTitle: string;

  @Column({ name: 'tour_code' })
  tourCode: string;

  @Column({ name: 'tour_description', default: null })
  tourDescription: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', default: null })
  deletedAt: Date;

  @ManyToOne(() => Seller, (seller) => seller.tour, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  seller?: Seller;
}
