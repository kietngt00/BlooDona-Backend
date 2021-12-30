import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    description: 'phone or email'
  })
  identity: string;

  @ApiProperty()
  password: string;
}