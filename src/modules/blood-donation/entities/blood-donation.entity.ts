import { BloodStationEntity } from './blood-station.entity';
import { UserEntity } from './../../user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blood_donation')
export class BloodDonationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, {})
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @Column()
  blood_volume: number;

  @ManyToOne(() => BloodStationEntity)
  @JoinColumn({ name: 'blood_station_id' })
  blood_station_id: number;

  @Column()
  date: Date;
}
