import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Route, Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  static router : Router;
  constructor( router: Router) { 
    AuthInterceptor.router = router
  }

  httpErrorHandle(error: HttpErrorResponse) {
    if (error.status == 401) {
      localStorage.removeItem('token');
      const url = AuthInterceptor.router.createUrlTree(['/login'], {
        queryParams: {
          return_url: AuthInterceptor.router.url
        }
      })
      AuthInterceptor.router.navigateByUrl(url);
    }
    return throwError(error);
  }

intercept(request: HttpRequest < unknown >, next: HttpHandler): Observable < HttpEvent < unknown >> {
  const token = localStorage.getItem('token');
  if(token) {
    var tokenizedReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    return next.handle(tokenizedReq).pipe(catchError(this.httpErrorHandle));
  }
    return next.handle(request).pipe(catchError(this.httpErrorHandle));
}
}
