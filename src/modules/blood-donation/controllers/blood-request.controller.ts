import { BloodRequestDto } from './../dtos/blood-request.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiTags('Blood Request')
@Controller('blood-request')
export class BloodRequestController {
  @Post('')
  async create(@Body() payload: BloodRequestDto) {
    return payload;
  }
}