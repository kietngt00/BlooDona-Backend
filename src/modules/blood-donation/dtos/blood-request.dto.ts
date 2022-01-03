import { ApiProperty } from "@nestjs/swagger";
import { IsDefined } from "class-validator";
import { UrgentLevel } from "../entities/blood-request.entity";


export class BloodRequestDto {
  @IsDefined()
  @ApiProperty({ enum: UrgentLevel })
  urgentLevel: UrgentLevel;
}
