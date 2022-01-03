import { DuplicateResponse, SuccessResponse } from './../../../common/response.factory';
import {
  BloodRequestEntity,
  UrgentLevel,
} from './../entities/blood-request.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BloodRequestMapperEntity } from '../entities/blood-request-mapper.entity';
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
  ) {}

  async createRequest(
    userId: number,
    urgentLevel: UrgentLevel,
    volume: number,
    description: string,
  ) {
    const activeRequest = await this.requestRepository.findOne({
      user_id: userId,
      active: true
    })
    if(activeRequest)
      return new DuplicateResponse({message: "blood-request"})

    this.requestRepository.insert({
      user_id: userId,
      urgent_level: urgentLevel,
      expected_volume: volume,
      description
    })

    /** TODO: send request to blood hospital */

    return new SuccessResponse();
  }

  async sendToUsers() {
    
  }
}
