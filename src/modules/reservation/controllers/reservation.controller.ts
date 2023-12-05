import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/decoraters/userPayload.decorator';
import { Payload } from 'src/modules/user/dto/payload.dto';
import { ReservationStatus } from '../consts/reservationStatus.enum';
import { ApproveReservationRequest } from '../dto/approveReservationRequest.dto';
import { ReservationRequest } from '../dto/reservationRequest.dto';
import { ReservationService } from '../services/reservation.service';

@ApiTags('예약')
@Controller('/reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiOperation({ description: '내 예약 내역 모두 가져오기' })
  @Get('/me')
  async fetchMyReservationList(@UserPayload() userInfo: Payload) {
    return await this.reservationService.fetchMyReservationList(userInfo);
  }

  @ApiOperation({
    description: '내 예약 내역 모두 가져오기(판매자)',
  })
  @Get('/seller/me')
  async fetchMySellerReservationList(
    @Query('onlyWait') onlyWait: boolean,
    @UserPayload() userInfo: Payload,
  ) {
    return await this.reservationService.fetchMySellerReservationList(
      onlyWait,
      userInfo,
    );
  }

  @ApiOperation({
    description: '예약 신청하기\ndate는 `2023-01-01` 형태로 작성',
    deprecated: true,
  })
  @Post('/:tourId')
  async addReservation(
    @Body() request: ReservationRequest,
    @UserPayload() userInfo: Payload,
  ) {
    return await this.reservationService.addReservation(request, userInfo);
  }

  @ApiOperation({
    description: '예약 내역 승인하기(판매자)',
  })
  @Post('/seller/approve')
  async approveReservation(
    @Body() request: ApproveReservationRequest,
    @UserPayload() userInfo: Payload,
  ) {
    return await this.reservationService.changeReservationStatus(
      request,
      userInfo,
      ReservationStatus.DENY,
    );
  }

  @ApiOperation({
    description: '예약 내역 거부하기(판매자)',
  })
  @Post('/seller/deny')
  async denyReservation(
    @Body() request: ApproveReservationRequest,
    @UserPayload() userInfo: Payload,
  ) {
    return await this.reservationService.changeReservationStatus(
      request,
      userInfo,
      ReservationStatus.DENY,
    );
  }

  @ApiOperation({
    description: '예약 취소하기',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/')
  async deleteReservation(
    @Query('reservationUid') reservationUid: string,
    @UserPayload() userInfo: Payload,
  ) {
    return await this.reservationService.deleteReservation(
      reservationUid,
      userInfo,
    );
  }
}
