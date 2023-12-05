import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReservationService } from '../services/reservation.service';

@ApiTags('예약')
@Controller('/reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiOperation({ description: '내 예약 내역 모두 가져오기' })
  @Get('/me')
  async fetchMyReservationList() {
    return await this.reservationService.fetchMyReservationList();
  }

  @ApiOperation({ description: '내 예약 내역 모두 가져오기' })
  @Get('/seller/me')
  async fetchMySellerReservationList() {
    return await this.reservationService.fetchMySellerReservationList();
  }
}
