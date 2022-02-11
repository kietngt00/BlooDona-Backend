import { UserMedicalEntity } from './../../user/entities/user-medical.entity';
import {
  DuplicateResponse,
  InternalErrorResponse,
  NotFoundResponse,
  SuccessResponse,
} from './../../../common/response.factory';
import {
  BloodRequestEntity,
  BloodType,
  UrgentLevel,
} from './../entities/blood-request.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BloodRequestMapperEntity,
  DonateStatus,
} from '../entities/blood-request-mapper.entity';
import { BloodStationEntity } from '../entities/blood-station.entity';

@Injectable()
export class BloodRequestService {
  constructor(
    @InjectRepository(BloodRequestEntity)
    private readonly requestRepository: Repository<BloodRequestEntity>,
    @InjectRepository(BloodRequestMapperEntity)
    private readonly mapperRepository: Repository<BloodRequestMapperEntity>,
    @InjectRepository(BloodStationEntity)
    private readonly stationEntity: Repository<BloodStationEntity>,
    @InjectRepository(UserMedicalEntity)
    private readonly medicalRepository: Repository<UserMedicalEntity>,
  ) {}

  async createRequest(
    userId: number,
    urgentLevel: UrgentLevel,
    volume: number,
    description: string,
  ) {
    const [activeRequest, medicalInfo] = await Promise.all([
      this.requestRepository.findOne({
        user_id: userId,
        active: true,
      }),
      this.medicalRepository.findOne({ user_id: userId }),
    ]);

    if (activeRequest)
      return new DuplicateResponse({ message: 'blood_request' });

    this.requestRepository.insert({
      user_id: userId,
      urgent_level: urgentLevel,
      expected_volume: volume,
      description,
      blood_type: medicalInfo?.blood_type,
    });

    /** TODO: send request to blood hospital */

    return new SuccessResponse();
  }

  async sendToUsers(
    requestId: number,
    numberPeople: number,
    bloodType: BloodType,
  ) {
    const pushUsers = await this.medicalRepository.find({
       take: numberPeople, 
       where: {
         blood_type: bloodType,
         can_donate: true
       }
      }
    );

    const mapperEntities = pushUsers.map((item) => {
      return this.mapperRepository.create({
        user_id: item.user_id,
        blood_request_id: requestId,
      });
    });
    this.mapperRepository.insert(mapperEntities);

    /** TODO: push notification */
    return new SuccessResponse();
  }

  async responseRequest(userId: number, requestId: number, accept: boolean) {
    try {
      const result = await this.mapperRepository.update(
        { user_id: userId, blood_request_id: requestId },
        { status: accept ? DonateStatus.ACCEPTED : DonateStatus.REJECTED },
      );
      if (result.affected) return new SuccessResponse();
      return new NotFoundResponse({ message: 'request_mapper' });
    } catch (error) {
      console.log(error);
      return new InternalErrorResponse();
    }
  }

  async getAllRequest(user_id: number) {
    const results = await this.requestRepository.find({ user_id });
    return new SuccessResponse(results);
  }

  async getActiveRequest(user_id: number) {
    const result = await this.requestRepository.findOne({
      user_id,
      active: true,
    });
    return new SuccessResponse(result);
  }

  async inactiveRequest(user_id: number) {
    const result = await this.requestRepository.update(
      { user_id, active: true },
      { active: false },
    );
    if (result.affected) return new SuccessResponse();
    return new NotFoundResponse({ message: 'active_request' });
  }

  async editRequest(
    requestId: number,
    urgentLevel: UrgentLevel,
    expectedVolume: number,
    active: boolean,
  ) {
    let updateData = {};
    if (urgentLevel) updateData['urgent_level'] = urgentLevel;
    if (expectedVolume) updateData['expected_volume'] = expectedVolume;
    if (active) updateData['active'] = active;
    const result = await this.requestRepository.update(
      { id: requestId },
      updateData,
    );
    if (result.affected) return new SuccessResponse();
    return new NotFoundResponse({ message: 'request' });
  }
}
