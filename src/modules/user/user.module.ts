import { UserMedical } from './entities/user-medical.entity';
import { UserLocation } from './entities/user-location.entity';
import { UserInfo } from './entities/user-info.entity';
import { AuthModule } from './../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserInfo, UserLocation, UserMedical]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
