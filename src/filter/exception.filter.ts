import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status: number;

    let message: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as object;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Internal server error',
      };

      // 处理请求参数校验抛出的错误
      const exceptionMsg = (exception as Error)?.message;
      if (exceptionMsg && exceptionMsg.startsWith('Validation Failed')) {
        status = HttpStatus.BAD_REQUEST;
        message.statusCode = status;
        message.message = exceptionMsg;
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...message,
    });
  }
}
