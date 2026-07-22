import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseDTO } from 'src/common/dto/error-response.dto';

interface ExceptionResponseShape {
  message?: string | string[];
  error?: string;
}

/**
 * Global exception filter that standardizes error responses across the application.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let details: string | string[] | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse =
        exception.getResponse() as ExceptionResponseShape;
      const responseMessage = exceptionResponse.message;

      message = Array.isArray(responseMessage)
        ? responseMessage.join(', ')
        : responseMessage || exception.message || message;

      if (exception instanceof BadRequestException) {
        if (Array.isArray(responseMessage)) {
          details = responseMessage;
        } else if (exceptionResponse.error) {
          details = exceptionResponse.error;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    const errorResponse: ErrorResponseDTO = {
      statusCode,
      message,
      details,
      path: request.url,
    };

    response.status(statusCode).json(errorResponse);
  }
}
