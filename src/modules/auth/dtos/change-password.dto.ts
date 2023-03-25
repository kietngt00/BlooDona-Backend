import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({ required: false })
    oldPassword: string;

    @ApiProperty({ required: false })
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, {
        message:
        'password must contain at least 1 number, 1 letter, 1 special character, and have minimun length of 6.',
    })
    newPassword: string;

    @ApiProperty({ required: false })
    confirmPassword: string;
}