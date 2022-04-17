import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class GlobalFilterException implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // console.log(exception);
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    let message = exception as any;
    let code = 'HttpException';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    switch (true) {
      case exception instanceof HttpException:
        status = (exception as HttpException).getStatus();
        break;
      case exception instanceof QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        code = (exception as any).code;
        break;
      case exception instanceof EntityNotFoundError:
        status = HttpStatus.NOT_FOUND;
        message = (exception as EntityNotFoundError).name;
        code = (exception as any).code;
        break;
    }
    response
      .status(status)
      .json(GlobalResponseError(status, message, code, request));
  }
}

export const GlobalResponseError: (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
) => IResponseError = (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
): IResponseError => {
  return {
    statusCode,
    message,
    code,
    timestamp: new Date().toISOString(),
    method: request.method,
  };
};

export interface IResponseError {
  statusCode: number;
  message: string;
  code: string;
  timestamp: string;
  method: string;
}
