import { UserMedicalEntity } from './entities/user-medical.entity';
import { UserLocationEntity } from './entities/user-location.entity';
import { UserInfoEntity } from './entities/user-info.entity';
import { AuthModule } from './../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserInfoEntity,
      UserLocationEntity,
      UserMedicalEntity,
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
