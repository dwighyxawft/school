import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  
  @Injectable()
  export class AdminAuthInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const accessToken = request.cookies['admin_token'];
      if (accessToken) {
        request.headers.authorization = `Bearer ${accessToken}`;
      }
  
      return next.handle().pipe(
        tap(() => {
          // Perform any additional operations here
        }),
      );
    }
  }
  