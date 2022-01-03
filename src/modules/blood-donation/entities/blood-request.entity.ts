import { UserEntity } from './../../user/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum UrgentLevel {
  VERY_URGENT = 'very_urgent',
  URGENT = 'urgent',
  NORMAL = 'normal',
}

export enum BloodType {
  A = 'A',
  B = 'B',
  AB = 'AB',
  O = 'O',
}

@Entity('blood_request')
export class BloodRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user_id: number; // Id of user sending request

  @Column({ type: 'enum', enum: UrgentLevel })
  urgent_level: UrgentLevel;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: BloodType })
  blood_type: BloodType; // query from medical_info of user

  @Column({ default: 0 })
  blood_donors: number; // count number of people donate

  @Column({ nullable: true })
  expected_volume: number;

  @Column({ default: 0 })
  current_volume: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
