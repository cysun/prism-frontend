import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt_token = localStorage.getItem('jwt_token');
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${jwt_token}` }
    })

    return !jwt_token ? next.handle(req) : next.handle(authReq);
  }
}
