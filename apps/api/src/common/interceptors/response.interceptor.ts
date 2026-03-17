import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface StandardResponse<T> {
  success: boolean
  message: string
  data?: T
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If response already has a `success` field, pass through as-is
        if (
          data !== null &&
          typeof data === 'object' &&
          'success' in (data as object)
        ) {
          return data as unknown as StandardResponse<T>
        }

        return {
          success: true,
          message: 'Success',
          data,
        }
      }),
    )
  }
}
