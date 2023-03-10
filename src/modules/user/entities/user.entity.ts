import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SocialLogin {
  FACEBOOK,
  GOOGLE,
  APPLE,
}

export enum UserRole {
  USER,
  HOSPITAL,
  BLOOD_HOSPITAL,
  MODERATOR,
  ADMIN,
}

export enum AccountStatus {
  PENDING,
  ACTIVE,
  BLOCK,
}

@Index(['social', 'social_id'], { unique: true })
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  password: string;

  @Column({ type: 'enum', enum: SocialLogin, nullable: true })
  social: SocialLogin;

  @Column({ type: 'varchar', nullable: true })
  social_id: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.PENDING })
  status: AccountStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
