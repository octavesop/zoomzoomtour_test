import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

class RegularOff {
  @ApiProperty()
  @IsBoolean()
  monday: boolean;

  @ApiProperty()
  @IsBoolean()
  tuesday: boolean;

  @ApiProperty()
  @IsBoolean()
  wednesday: boolean;

  @ApiProperty()
  @IsBoolean()
  thursday: boolean;

  @ApiProperty()
  @IsBoolean()
  friday: boolean;

  @ApiProperty()
  @IsBoolean()
  saturday: boolean;

  @ApiProperty()
  @IsBoolean()
  sunday: boolean;
}

export class TourOffRequest {
  @ApiProperty()
  @IsNotEmpty()
  regularDay: RegularOff;

  @ApiProperty()
  @IsNotEmpty()
  irregularDayList: string[];
}
