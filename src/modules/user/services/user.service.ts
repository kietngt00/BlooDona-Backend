import { UserInfoDto } from './../dtos/user-info.dto';
import {
  NotFoundResponse,
  SuccessResponse,
} from './../../../common/response.factory';
import { UserEntity } from './../entities/user.entity';
import { UserLocationEntity } from './../entities/user-location.entity';
import { UserInfoEntity } from './../entities/user-info.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserInfoEntity)
    private readonly infoRepository: Repository<UserInfoEntity>,
    @InjectRepository(UserLocationEntity)
    private readonly locationRepository: Repository<UserLocationEntity>,
  ) {}

  async getUserInfo(user: UserEntity) {
    const info = await this.infoRepository.findOne({ user_id: user.id });
    if (!info) return new SuccessResponse({ user_id: user.id, email: user.email, phone: user.phone });
    return new SuccessResponse({
      ...info,
      email: user.email,
      phone: user.phone,
    });
  }

  async editUserInfo(user: UserEntity, payload: UserInfoDto) {
    const info = await this.infoRepository.findOne({ user_id: user.id });
    if (!info) {
      const record = this.infoRepository.create({
        user_id: user.id,
        ...payload,
      });
      console.log(record)
      console.log(payload)
      this.infoRepository.save(record);
      return new SuccessResponse({
        ...record,
        email: user.email,
        phone: user.phone,
      });
    } else {
      const result = await this.infoRepository.save({
        id: info.id,
        ...payload,
      });
      return new SuccessResponse({
        ...result,
        email: user.email,
        phone: user.phone,
      });
    }
  }

  async hospitalGetUserInfo(id: number){
    const [user, info] = await Promise.all([
      this.userRepository.findOne(id),
      this.infoRepository.findOne({ user_id: id })
    ]);
    if(!info) return new NotFoundResponse({message: "user"});
    if (!info) return new SuccessResponse({ user_id: id, email: user.email, phone: user.phone });
    return new SuccessResponse({...info, email: user.email, phone: user.phone });
  }
}
