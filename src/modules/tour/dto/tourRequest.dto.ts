import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TourRequest {
  @ApiProperty()
  @IsString()
  readonly tourTitle: string;

  @ApiProperty()
  @IsString()
  readonly tourCode: string;

  @ApiProperty()
  @IsString()
  readonly tourDescription: string;
}
