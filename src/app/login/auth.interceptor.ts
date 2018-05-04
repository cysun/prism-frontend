import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  handleAuthError(err: HttpErrorResponse): Observable<any> {
    console.log(this.router.url);
    if (this.router.url.indexOf('review') !== -1) {
      return Observable.throw(err);
    }
    const interceptCodes = [401, 403, 504];
    if (interceptCodes.indexOf(err.status) !== -1) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('currentUser');
      this.router.navigate(['login']);
    }
    return Observable.throw(err);
  }

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt_token = localStorage.getItem('jwt_token');
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${jwt_token}` }
    })
    return !jwt_token ? next.handle(req) : next.handle(authReq).catch(x => this.handleAuthError(x));
  }
}
