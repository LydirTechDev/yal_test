import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadinService } from './loadin.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor(
    public loaderservice: LoadinService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderservice.isLoadin.next(true);
    return next.handle(req).pipe(
      finalize(
        () => {
          this.loaderservice.isLoadin.next(false);
          this.loaderservice.message = req.reportProgress;
          console.log("🚀 ~ file: interceptor.service.ts ~ line 23 ~ InterceptorService ~ intercept ~ this.loaderservice.message", this.loaderservice.message)
        }
      )
    )
  }
}
