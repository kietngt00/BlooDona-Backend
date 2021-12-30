import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";

export class VerifyDto {
  @ApiProperty({ required: false })
  phone: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false})
  code: string;

  @ApiProperty()
  @IsIn(['active', 'resend'])
  action: string;
}