import { SuccessResponse } from './../../../common/response.factory';
import { BloodStationEntity } from './../entities/blood-station.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BloodDonationEntity } from '../entities/blood-donation.entity';
@Injectable()
export class BloodDonationService {
  constructor(
    @InjectRepository(BloodDonationEntity)
    private readonly donationRepository: Repository<BloodDonationEntity>,
    @InjectRepository(BloodStationEntity)
    private readonly stationRepository: Repository<BloodStationEntity>,
  ) {}

  async getAllDonations(user_id: number) {
    const result = await this.donationRepository
      .createQueryBuilder('blood_donation')
      .leftJoin('blood_donation.blood_station_id', 'blood_station')
      .where('blood_donation.user_id = :user_id', { user_id })
      .getMany();
    return new SuccessResponse(result);
  }
}
