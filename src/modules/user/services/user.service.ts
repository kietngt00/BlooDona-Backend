import { UserMedicalEntity } from './../entities/user-medical.entity';
import { UserLocationDto, UserMedicalDto } from './../dtos/user.dto';
import { UserInfoDto } from '../dtos/user.dto';
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
    @InjectRepository(UserMedicalEntity)
    private readonly medicalRepository: Repository<UserMedicalEntity>
  ) {}

  async getUserInfo(user: UserEntity) {
    const info = await this.infoRepository.findOne({ user_id: user.id });
    if (!info)
      return new SuccessResponse({
        user_id: user.id,
        email: user.email,
        phone: user.phone,
      });
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

  async hospitalGetUserInfo(id: number) {
    const [user, info] = await Promise.all([
      this.userRepository.findOne(id),
      this.infoRepository.findOne({ user_id: id }),
    ]);
    if (!info) return new NotFoundResponse({ message: 'user' });
    if (!info)
      return new SuccessResponse({
        user_id: id,
        email: user.email,
        phone: user.phone,
      });
    return new SuccessResponse({
      ...info,
      email: user.email,
      phone: user.phone,
    });
  }

  async getUserLocation(id: number) {
    const location = await this.locationRepository.findOne({ user_id: id });
    if (!location) return new NotFoundResponse({ message: 'location' });
    return new SuccessResponse(location);
  }

  async editUserLocation(id: number, payload: UserLocationDto) {
    const location = await this.locationRepository.findOne({ user_id: id });
    if (!location)
      this.locationRepository.insert({
        user_id: id,
        ...payload,
      });
    else
      this.locationRepository.save({
        id: location.id,
        user_id: id,
        ...payload,
      });
    return new SuccessResponse();
  }
  
  async getMedicalInfo(id: number) {
    const medicalInfo = await this.medicalRepository.findOne({user_id: id});
    if(medicalInfo) {
      return new SuccessResponse(medicalInfo);
    }
    const result = this.medicalRepository.create({
      user_id: id,
    })
    this.userRepository.save(result);
    return new SuccessResponse(result)
  }

  async editMedicalInfo(id: number,  payload: UserMedicalDto) {
    const medicalInfo = await this.medicalRepository.findOne({ user_id: id });
    if(!medicalInfo)
      this.medicalRepository.insert({
        user_id: id,
        ...payload
      });
    else 
      this.medicalRepository.save({
        id: medicalInfo.id,
        user_id: id,
        ...payload
      })
    return new SuccessResponse();
  }

  async editCanDonate(id: number) {
    const medicalInfo = await this.medicalRepository.findOne({ user_id: id });
    if(!medicalInfo) return new NotFoundResponse({ message: "medical" });
    if(medicalInfo.can_donate) medicalInfo.can_donate = false;
    else {
      const now = new Date()
      if(medicalInfo.last_donation) {
        const diffDays = (now.getTime() - medicalInfo.last_donation.getTime()) / (1000 * 3600 * 24);
        if(diffDays > 120) medicalInfo.can_donate = true;
      }
    }
    this.medicalRepository.save(medicalInfo)
    return new SuccessResponse({ can_donate: medicalInfo.can_donate });
  }
}
