import { BloodRequestEntity } from './../entities/blood-request.entity';
import { ConfigService } from '@nestjs/config';
import { UserEntity, UserRole } from './../../user/entities/user.entity';
import {
  SuccessResponse,
  AuthorizationProtectResponse,
  NotFoundResponse,
} from './../../../common/response.factory';
import { BloodStationEntity } from './../entities/blood-station.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BloodDonationEntity } from '../entities/blood-donation.entity';
import * as jwt from 'jsonwebtoken';
import {
  BloodRequestMapperEntity,
  DonateStatus,
} from '../entities/blood-request-mapper.entity';
@Injectable()
export class BloodDonationService {
  constructor(
    @InjectRepository(BloodDonationEntity)
    private readonly donationRepository: Repository<BloodDonationEntity>,
    @InjectRepository(BloodStationEntity)
    private readonly stationRepository: Repository<BloodStationEntity>,
    @InjectRepository(BloodRequestMapperEntity)
    private readonly mapperRepository: Repository<BloodRequestMapperEntity>,
    @InjectRepository(BloodRequestEntity)
    private readonly requestRepository: Repository<BloodRequestEntity>,

    private readonly configService: ConfigService,
  ) {}

  async getDonations(user: UserEntity, id?: number) {
    if (id) return this.getOneById(user, id);
    return this.getAllDonations(user.id);
  }

  async getAllDonations(user_id: number) {
    const result = await this.donationRepository
      .createQueryBuilder('blood_donation')
      .leftJoin('blood_donation.blood_station_id', 'blood_station')
      .where('blood_donation.user_id = :user_id', { user_id })
      .getMany();
    return new SuccessResponse(result);
  }

  async getOneById(user: UserEntity, id: number) {
    const result = await this.donationRepository
      .createQueryBuilder('blood_donation')
      .leftJoin('blood_donation.blood_station_id', 'blood_station')
      .where('blood_donation.id = :id', { id })
      .getOne();
    if (!result) return new NotFoundResponse({ message: 'donation' });
    if (user.id === result.user_id) return new SuccessResponse(result);
    if (user.role === UserRole.USER || user.role === UserRole.HOSPITAL)
      return new AuthorizationProtectResponse();
    return new SuccessResponse(result);
  }

  async createQrCode() {
    const today = new Date().toISOString().split('T')[0];
    const QrCode1 = jwt.sign(
      { blood_station_id: 1, volume: 300, date: today },
      this.configService.get('QRCODE_PRIVATE_KEY'),
    );
    const QrCode2 = jwt.sign(
      { blood_station_id: 1, volume: 450, date: today },
      this.configService.get('QRCODE_PRIVATE_KEY'),
    );
    /** TODO: send mail QrCode */
    return new SuccessResponse({ QrCode1, QrCode2 });
  }

  async verifyDonation(userId: number, requestId: number, code: string) {
    // Decode
    const payload = (await jwt.verify(
      code,
      this.configService.get('QRCODE_PRIVATE_KEY'),
    )) as { blood_station_id: number; volume: number; date: Date };
    
    // Find request, update request mapper
    const [request, updateMapperResult] = await Promise.all([
      this.requestRepository.findOne({
        id: requestId,
        active: true,
      }),
      this.mapperRepository.update(
        {
          user_id: userId,
          blood_request_id: requestId,
          status: DonateStatus.ACCEPTED,
        },
        {
          status: DonateStatus.DONATED,
          blood_station_id: payload.blood_station_id,
        },
      ),
    ]);
    if (!request) return new NotFoundResponse({ message: 'request' });
    if (!updateMapperResult.affected)
      return new NotFoundResponse({ message: 'mapper' });

    // Update request, create donation record
    request.blood_donors += 1;
    request.current_volume += payload.volume;
    this.requestRepository.save(request);
    this.donationRepository.insert({
      user_id: userId,
      blood_volume: payload.volume,
      blood_station_id: payload.blood_station_id,
      date: new Date(),
    });

    return new SuccessResponse();
  }
}
