import { BloodRequestEntity } from './../entities/blood-request.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
    private readonly stationEntity: Repository<BloodStationEntity>
  ){}
}