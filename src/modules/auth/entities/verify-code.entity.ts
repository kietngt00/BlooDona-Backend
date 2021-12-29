import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('verification-code')
export class VerifyCodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 6 })
  code: string;

  @UpdateDateColumn()
  updated_at: Date;
}
