import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { UiModule } from '../shared/ui/ui.module';
import { JWTTokenService } from '../core/services/jwt.service';
import { ButtonsModule, InputsModule, WavesModule } from 'angular-bootstrap-md';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NgbAlertModule,
    InputsModule,
    ButtonsModule,
    WavesModule,
    UiModule
  ]
})
export class AuthModule { }
