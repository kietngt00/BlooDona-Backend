import { UserLocationDto, UserMedicalDto } from './../dtos/user.dto';
import { UserInfoDto } from '../dtos/user.dto';
import { UserService } from './../services/user.service';
import { UserEntity } from './../entities/user.entity';
import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/user.decorator';
import { BloodHospitalGuard } from 'src/guards/blood-hospital.guard';
@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor( private readonly service: UserService){}

  @Get('info')
  async getUserInfo(@CurrentUser() user: UserEntity){
    return await this.service.getUserInfo(user);
  }

  @Put('info')
  async editUserInfo(@CurrentUser() user: UserEntity, @Body() payload: UserInfoDto) {
    return await this.service.editUserInfo(user, payload);
  }

  @UseGuards(BloodHospitalGuard)
  @Get('info/:id')
  async hospitalGetUserInfo(@Param('id') id: number){
    return await this.service.hospitalGetUserInfo(id);
  }

  @Get('location')
  async getUserLocation(@CurrentUser() user: UserEntity){
    return await this.service.getUserLocation(user.id);
  }

  @Put('location')
  async editUserLocation(@CurrentUser() user: UserEntity, @Body() payload: UserLocationDto){
    return await this.service.editUserLocation(user.id, payload)
  }

  @UseGuards(BloodHospitalGuard)
  @Get('location/:id')
  async hospitalGetUserLocation(@Param('id') id: number){
    return await this.service.getUserLocation(id);
  }

  @Get('medical')
  async getUserMedical(@CurrentUser() user: UserEntity){
    return await this.service.getMedicalInfo(user.id);
  }

  @Put('medical')
  async editUserMedical(@CurrentUser() user: UserEntity, @Body() payload: UserMedicalDto){
    return await this.service.editMedicalInfo(user.id, payload);
  }

  @Put('medical/can-donate')
  async editCanDonate(@CurrentUser() user: UserEntity) {
    return await this.service.editCanDonate(user.id);
  }

  @UseGuards(BloodHospitalGuard)
  @Get('medical/:id')
  async hospitalGetUserMedical(@Param('id') id: number){
    return await this.service.getMedicalInfo(id);
  }
}
