import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundReservationException extends HttpException {
  constructor() {
    super('예약 정보가 존재하지 않습니다.', HttpStatus.BAD_REQUEST);
  }
}
