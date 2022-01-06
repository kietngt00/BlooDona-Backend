import { UserEntity } from './../../user/entities/user.entity';
import { BloodDonationService } from './../services/blood-donation.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/user.decorator';
@UseGuards(AuthGuard())
@ApiTags('Blood Donation')
@ApiBearerAuth()
@Controller('blood-donation')
export class BloodDonationController {
  constructor(private readonly service: BloodDonationService) {}

  @Get()
  async getAllDonations(@CurrentUser() user: UserEntity) {
    return await this.service.getAllDonations(user.id);
  }
}
