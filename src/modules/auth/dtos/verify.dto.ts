import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn } from "class-validator";

export class VerifyDto {
  @ApiProperty({ required: false })
  phone: string;

  @ApiProperty({ required: false })
  @IsEmail()
  email: string;

  @ApiProperty({ required: false})
  code: string;

  @ApiProperty()
  @IsIn(['active', 'resend'])
  action: string;
}