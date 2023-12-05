import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/decoraters/userPayload.decorator';
import { Payload } from 'src/modules/user/dto/payload.dto';
import { JwtAuthGuard } from 'src/modules/user/guards/jwt.guard';
import { SellerRequest } from '../dto/sellerRequest.dto';
import { Seller } from '../entities/seller.entity';
import { SellerService } from '../services/seller.service';

@UseGuards(JwtAuthGuard)
@ApiTags('판매자')
@Controller('/seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}
  @ApiOperation({ description: '내 판매자 정보를 가져옵니다.' })
  @Get('/me')
  async fetchMySellerInfo(@UserPayload() userInfo: Payload): Promise<Seller> {
    return await this.sellerService.fetchMySellerInfo(userInfo);
  }

  @ApiOperation({ description: '판매자로 추가 가입을 진행합니다.' })
  @Post('/')
  async registerAsSeller(
    @Body() request: SellerRequest,
    @UserPayload() userInfo: Payload,
  ): Promise<void> {
    return await this.sellerService.registerAsSeller(request, userInfo);
  }
}
