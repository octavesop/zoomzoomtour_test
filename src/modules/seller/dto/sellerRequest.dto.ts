import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SellerRequest {
  @ApiProperty()
  @IsString()
  sellerName: string;

  @ApiProperty()
  @IsOptional()
  sellerNickname?: string;
}
