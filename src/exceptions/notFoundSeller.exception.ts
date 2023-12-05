import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundSellerException extends HttpException {
  constructor() {
    super('판매자 정보가 존재하지 않습니다.', HttpStatus.BAD_REQUEST);
  }
}
