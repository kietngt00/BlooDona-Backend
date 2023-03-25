import { ApiProperty } from "@nestjs/swagger";
import { IsDefined } from "class-validator";

export class LoginDto {
  @IsDefined()
  @ApiProperty({
    description: 'phone or email'
  })
  identity: string;

  @IsDefined()
  @ApiProperty()
  password: string;
}