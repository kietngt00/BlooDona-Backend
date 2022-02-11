import { BloodType } from "src/modules/blood-donation/entities/blood-request.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('user_medical')
export class UserMedical {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, {})
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @Column({ type: 'enum', enum: BloodType })
  blood_type: BloodType;

  @Column({ default: false })
  can_donate: boolean;

  @Column({ nullable: true })
  test_paper: number // TODO: set relation to file table
}