import { IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class VerifyDonationDto {
  @IsDefined()
  @ApiProperty()
  request_id: number;

  @IsDefined()
  @ApiProperty()
  code: string;
}