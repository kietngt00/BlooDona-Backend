import { AdminGuard } from './../../../guards/admin.guard';
import { VerifyDonationDto } from './../dtos/blood-donation.dto';
import { UserEntity } from './../../user/entities/user.entity';
import { BloodDonationService } from './../services/blood-donation.service';
import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
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
  async getDonations(
    @CurrentUser() user: UserEntity,
    @Query('donation_id') donationId: number,
  ) {
    return await this.service.getDonations(user, donationId);
  }

  /** @description Admin manually send qr-code to blood station if the cron job does not work */
  @UseGuards(AdminGuard)
  @Post('qr-code')
  async createQrCode() {
    return await this.service.createQrCode();
  }

  @Put('verify-donation')
  async verifyDonation(@CurrentUser() user: UserEntity, @Body() payload: VerifyDonationDto) {
    return await this.service.verifyDonation(user.id, payload.request_id, payload.code);
  }
}
