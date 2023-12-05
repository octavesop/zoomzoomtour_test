import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class ReservationRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly tourUid: number;

  @ApiProperty()
  @IsString()
  @IsDateString()
  readonly date: string;
}
