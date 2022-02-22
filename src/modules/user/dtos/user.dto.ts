import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "../entities/user-info.entity";

export class UserInfoDto {
  @ApiProperty({ nullable: true})
  first_name?: string;

  @ApiProperty({ nullable: true})
  last_name?: string;

  @ApiProperty({ enum: Gender, nullable: true})
  gender?: Gender;

  @ApiProperty({ nullable: true})
  date_of_birth?: Date;

  @ApiProperty({ nullable: true})
  avatar?: number // id of the uploaded image

  @ApiProperty({ nullable: true})
  national_id?: string;
}

export class UserLocationDto {
  @ApiProperty()
  location: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}