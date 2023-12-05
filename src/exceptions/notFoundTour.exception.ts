import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundTourException extends HttpException {
  constructor() {
    super('해당 투어 정보가 존재하지 않습니다.', HttpStatus.BAD_REQUEST);
  }
}
