import { AuthModule } from './../auth/auth.module';
import { BloodRequestController } from './controllers/blood-request.controller';
import { BloodRequestMapperEntity } from './entities/blood-request-mapper.entity';
import { BloodRequestEntity } from './entities/blood-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BloodDonationController } from './controllers/blood-donation.controller';
import { BloodDonationService } from './services/blood-donation.service';
import { BloodDonationEntity } from './entities/blood-donation.entity';
import { BloodStationEntity } from './entities/blood-station.entity';
import { BloodRequestService } from './services/blood-request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BloodDonationEntity,
      BloodStationEntity,
      BloodRequestEntity,
      BloodRequestMapperEntity,
    ]),
    AuthModule
  ],
  controllers: [BloodDonationController, BloodRequestController],
  providers: [BloodDonationService, BloodRequestService],
  exports: [TypeOrmModule],
})
export class BloodDonationModule {}
