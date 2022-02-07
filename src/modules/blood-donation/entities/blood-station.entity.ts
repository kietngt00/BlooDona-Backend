import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('blood_station')
export class BloodStationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 1024 })
  location: string; // Ex: 78 Truong Dinh, Dong Da, Ha Noi
  
  @Column({ type: 'double' })
  longitude: number;

  @Column({ type: 'double' })
  latitude: number;
}