import { BloodType, UrgentLevel } from './../entities/blood-request.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class BloodRequestDto {
  @IsDefined()
  @ApiProperty({ enum: UrgentLevel })
  urgentLevel: UrgentLevel;

  @IsDefined()
  @ApiProperty()
  volume: number;

  @ApiProperty({ required: false })
  description: string;
}

export class SendRequestDto {
  @IsDefined()
  @ApiProperty()
  requestId: number;

  @ApiProperty()
  @IsDefined()
  numberPeople: number;

  @IsDefined()
  @ApiProperty({ enum: BloodType})
  bloodType: BloodType
}

export class ResponseRequestDto {
  @IsDefined()
  @ApiProperty()
  requestId: number;

  @IsDefined()
  @ApiProperty()
  accept: boolean;
}

export class EditRequestDto {
  @ApiProperty({ enum: UrgentLevel, required: false })
  urgentLevel: UrgentLevel;

  @ApiProperty({ required: false })
  expectedVolume: number;

  @ApiProperty({ required: false })
  active: boolean;

}