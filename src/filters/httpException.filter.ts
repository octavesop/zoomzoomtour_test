import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// 모든 exception을 관리하는 httpFilter
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    try {
      const message =
        exception?.getResponse().toString() === '[object Object]'
          ? exception.message
          : exception?.getResponse().toString();

      const status = exception?.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;

      const responseJson = {
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      // class-validator에 의한 message 처리를 위해 있는 로직
      if (
        exception?.getResponse()?.statusCode === 400 &&
        exception?.getResponse()?.error === 'Bad Request'
      ) {
        responseJson.message = exception?.getResponse().message.join(' / ');
      }

      response.status(status).json(responseJson);
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
