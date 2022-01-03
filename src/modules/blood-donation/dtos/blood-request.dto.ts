import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { UrgentLevel } from '../entities/blood-request.entity';

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
