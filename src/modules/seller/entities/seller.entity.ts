import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'SELLER' })
export class Seller {
  constructor(sellerUid: number) {
    this.sellerUid = sellerUid;
  }
  @PrimaryGeneratedColumn({ name: 'seller_uid' })
  sellerUid: number;

  @Column({ name: 'seller_uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'seller_name' })
  sellerName: string;

  @Column({ name: 'seller_nickname', default: null })
  sellerNickname: string;

  @Column({ name: 'is_activate', default: false })
  isActivate: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', default: null })
  deletedAt: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_uid' })
  @Column({ name: 'user_uid' })
  user: User;
}
