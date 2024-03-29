import { UserEntity } from './../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('verification-code')
export class VerifyCodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', length: 6 })
  code: string;

  @UpdateDateColumn()
  updated_at: Date;
}
