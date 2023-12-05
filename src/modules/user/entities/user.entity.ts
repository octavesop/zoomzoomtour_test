import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('USER')
export class User {
  constructor(userUid: number) {
    this.userUid = userUid;
  }
  @PrimaryGeneratedColumn({ name: 'user_uid' })
  userUid: number;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ name: 'user_pw' })
  @Exclude()
  userPw: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'user_nickname', default: null })
  userNickname: string;

  @Column({ name: 'user_email', unique: true })
  userEmail: string;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', default: null })
  deletedAt: Date;
}
