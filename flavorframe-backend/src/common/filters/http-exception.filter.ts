// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // İçine parametre vermediğimizde, sistemdeki İSTİSNASIZ tüm hataları yakalar
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Gelen hatanın bizim bildiğimiz standart bir HTTP hatası mı (örn: 404, 400), 
    // yoksa sunucunun patladığı bilinmeyen bir hata mı (500) olduğunu kontrol ediyoruz.
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Sunucu tarafında beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.' };

    // Frontend (React) tarafına göndereceğimiz temiz standart JSON kalıbı
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      // Eğer hata mesajı bir obje ise içinden mesajı çıkarıyoruz, değilse kendisini yazıyoruz
      message: typeof errorResponse === 'object' && errorResponse['message'] 
        ? errorResponse['message'] 
        : errorResponse,
    });
  }
}