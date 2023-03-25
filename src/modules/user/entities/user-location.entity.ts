import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('user_location')
export class UserLocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, {})
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  location: string; // Ex: 78 Truong Dinh, Dong Da, Ha Noi
  
  @Column({ type: 'double', nullable: true })
  longitude: number;

  @Column({ type: 'double', nullable: true })
  latitude: number;
}