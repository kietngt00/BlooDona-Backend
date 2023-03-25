import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, Matches, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsDefined()
  phone: string;

  @ApiProperty()
  @IsDefined()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, {
    message:
      'password must contain at least 1 number, 1 letter, 1 special character, and have minimun length of 6.',
  })
  password: string;

  @ApiProperty()
  @IsDefined()
  confirmPassword: string;
}

export class RegisterEmailDto {
  @ApiProperty()
  email: string;
}