import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('blood_station')
export class BloodStationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  location: string; // Ex: 78 Truong Dinh, Dong Da, Ha Noi
  
  @Column({ type: 'double', nullable: true })
  longitude: number;

  @Column({ type: 'double', nullable: true })
  latitude: number;
}