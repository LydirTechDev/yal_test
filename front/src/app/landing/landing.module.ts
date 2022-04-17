import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { ButtonsModule } from 'angular-bootstrap-md';


@NgModule({
  declarations: [
    WelcomePageComponent
  ],
  imports: [
    CommonModule,
    ButtonsModule,
    LandingRoutingModule
  ]
})
export class LandingModule { }
