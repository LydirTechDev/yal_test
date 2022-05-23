import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { SpinnerService } from './spinner/spinner.service';
import { SweetAlertService } from '../services/sweet-alert.service';


@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private sweetAlertService: SweetAlertService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.spinnerService.requestStarted()
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 0 && err.error instanceof ProgressEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        this.spinnerService.requestEnded()
        this.sweetAlertService.basicWarning('Ops! Verifier votre connexion.')
        this.spinnerService.resetSpinner()
      }
      if (err.status === 401) {
        this.spinnerService.requestEnded()
        this.spinnerService.resetSpinner()

        // auto logout if 401 response returned from api
        this.authService.logout();
        // location.reload();
      }
      this.spinnerService.requestEnded()
      this.spinnerService.resetSpinner()

      const error = err.error.message || err.statusText;
      return throwError(error)
    }));
  }
}
