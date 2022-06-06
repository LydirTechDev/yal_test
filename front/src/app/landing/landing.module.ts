import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { ButtonsModule } from 'angular-bootstrap-md';
import { NosServicesComponent } from './nos-services/nos-services.component';
import { AProposComponent } from './a-propos/a-propos.component';
import { ContactComponent } from './contact/contact.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [
    WelcomePageComponent,
    NosServicesComponent,
    AProposComponent,
    ContactComponent,
    SearchResultComponent
  ],
  imports: [
    CommonModule,
    ButtonsModule,
    LandingRoutingModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),

  ]
})
export class LandingModule { }
