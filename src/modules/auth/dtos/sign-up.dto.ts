import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  phone: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, {
    message:
      'password must contain at least one number, one letter, and one special character have minimun length of 6.',
  })
  password: string;

  @ApiProperty()
  confirmPassword: string;
}
