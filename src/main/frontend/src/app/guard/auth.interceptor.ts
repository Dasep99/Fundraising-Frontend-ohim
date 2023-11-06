import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthService} from "../service/auth.service";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    if (token) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });

      return next.handle(cloned).pipe(catchError(e => this.handleError(e)));
    }
    return next.handle(request)
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('token');
      this.router.navigate(['masuk']).then(
        () => {
          window.location.reload()
        }
      );
    }

    return throwError(() => error);
  }
}
