import { UserEntity } from './../../user/entities/user.entity';
import { BloodRequestEntity } from './blood-request.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BloodStationEntity } from './blood-station.entity';

export enum DonateStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  DONATED = 'donated',
}

@Entity('blood_request_mapper')
export class BloodRequestMapperEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => BloodRequestEntity)
  @JoinColumn({ name: 'blood_request_id' })
  blood_request_id: number;

  @Column({ type: 'enum', enum: DonateStatus, default: DonateStatus.PENDING })
  status: DonateStatus;

  @ManyToOne(() => BloodStationEntity, { nullable: true })
  @JoinColumn({ name: 'blood_station_id' })
  blood_station_id: number;
}
