import { UserEntity } from './user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

@Entity('user_info')
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, {})
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  avatar: number; // TODO: Set relation to file table

  @Column({ nullable: true })
  national_id: string;

  @Column({ nullable: true })
  user_location_id: number; // TODO: Set relation to user_location

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}