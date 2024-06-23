import * as express from 'express';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface Response<T> {
  data: T;
}

export interface responseValue {
  data: any;
  code: any;
  message?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<express.Response>();

    return next.handle().pipe(
      map((data) => {
        if (data) {
          const returnValue: responseValue = {
            data: data.message ? data.data : data,
            code: response.statusCode,
            message: data.message,
          };

          if (data.message) returnValue.message = `${data.message}`;
          return returnValue;
        } else {
          return {
            data: null,
          };
        }
      }),
    );
  }
}
