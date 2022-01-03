import { UserEntity } from './../../user/entities/user.entity';
import {
  BloodRequestDto,
  ResponseRequestDto,
  SendRequestDto,
} from './../dtos/blood-request.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BloodRequestService } from '../services/blood-request.service';
import { CurrentUser } from 'src/common/user.decorator';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiTags('Blood Request')
@Controller('blood-request')
export class BloodRequestController {
  constructor(private readonly bloodRequestService: BloodRequestService) {}

  @Post('')
  async create(
    @CurrentUser() user: UserEntity,
    @Body() payload: BloodRequestDto,
  ) {
    return await this.bloodRequestService.createRequest(
      user.id,
      payload.urgentLevel,
      payload.volume,
      payload.description,
    );
  }

  // BloodHospital Guard
  /** @description Blood Hospital send received request to other users */
  @Post('send-to-user')
  async sendToUser(@Body() payload: SendRequestDto) {
    return await this.bloodRequestService.sendToUsers(payload.requestId);
  }

  @Post('response')
  async responseRequest(
    @CurrentUser() user: UserEntity,
    @Body() payload: ResponseRequestDto,
  ) {
    return await this.bloodRequestService.responseRequest(
      user.id,
      payload.requestId,
      payload.accept,
    );
  }
}
