import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseDTO } from 'src/common/dto/error-response.dto';

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
      const exceptionResponse = exception.getResponse() as any;
      message = exceptionResponse.message || exception.message || message;

      // Convert NotFoundException (404) to BadRequest (400)
      if (exception instanceof NotFoundException) {
        statusCode = HttpStatus.BAD_REQUEST;
      }

      // Extract validation errors from BadRequestException
      if (exception instanceof BadRequestException) {
        if (Array.isArray(exceptionResponse.message)) {
          details = exceptionResponse.message;
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
