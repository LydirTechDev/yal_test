import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgbAlertModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsInterceptor } from './core/helpres/errors.interceptor';
import { LocalStoreManager } from './core/services/local-store-manager.service';
import { JWTTokenService } from './core/services/jwt.service';
import { LayoutsModule } from './layouts/layouts.module';
import { JwtInterceptor } from './core/helpres/jwt.interceptor';
import { InterceptorService } from './core/services/interceptor.service';
import { ButtonsModule, InputsModule, MDBBootstrapModule, WavesModule } from 'angular-bootstrap-md';
import { OperationsModule } from './operations/operations.module';
import { FinanceModule } from './finance/finance.module';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbAlertModule,
    NgbDropdownModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    ButtonsModule,
    WavesModule,
    InputsModule,
    LayoutsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    OperationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS,
      useClass: ErrorsInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    JWTTokenService,
    LocalStoreManager
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
