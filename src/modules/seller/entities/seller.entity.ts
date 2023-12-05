import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'SELLER' })
export class User {
  constructor(userUid: number) {
    this.sellerUid = userUid;
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

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', default: null })
  deletedAt: Date;
}
