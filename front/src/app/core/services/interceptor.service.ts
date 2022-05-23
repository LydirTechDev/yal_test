import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../helpres/spinner/spinner.service';
import { LoadinService } from './loadin.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor(
    public spinnerService: SpinnerService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.requestStarted();
    return next.handle(req).pipe(
      finalize(
        () => {
          this.spinnerService.requestEnded();
          this.spinnerService.resetSpinner()

          // this.spinnerService.message = req.reportProgress;
        }
      )
    )
  }
}
