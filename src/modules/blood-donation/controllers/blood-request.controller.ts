import { UserEntity } from './../../user/entities/user.entity';
import {
  BloodRequestDto,
  EditRequestDto,
  ResponseRequestDto,
  SendRequestDto,
} from './../dtos/blood-request.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
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

  @Get()
  async getAllRequests(
    @CurrentUser() user: UserEntity,
    @Query('active') active: boolean,
  ) {
    if (!active) return await this.bloodRequestService.getAllRequest(user.id);
    return await this.bloodRequestService.getActiveRequest(user.id);
  }

  @Put('inactive')
  async inactiveRequest(@CurrentUser() user: UserEntity) {
    return await this.bloodRequestService.inactiveRequest(user.id);
  }

  // BloodHospital Guard
  /** @description Blood Hospital edit blood request */
  @Put()
  async editRequest(
    @Query('request_id') requestId: number,
    @Body() payload: EditRequestDto,
  ) {
    return await this.bloodRequestService.editRequest(
      requestId,
      payload.urgentLevel,
      payload.expectedVolume,
      payload.active,
    );
  }
}
