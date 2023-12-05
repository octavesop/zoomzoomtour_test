import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class ApproveReservationRequest {
  @ApiProperty()
  @IsArray()
  readonly reservationUid: number[];
}
