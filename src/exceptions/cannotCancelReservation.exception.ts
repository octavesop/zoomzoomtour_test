import { HttpException, HttpStatus } from '@nestjs/common';

export class CannotCancelReservationException extends HttpException {
  constructor() {
    super(
      '최대 3일 전의 예약까지만 취소할 수 있습니다.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
