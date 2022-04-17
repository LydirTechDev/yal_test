import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddOneShippmnetComponent } from './components/shippments/add-one-shippmnet/add-one-shippmnet.component';
import { UploadShippmnetsComponent } from './components/shippments/upload-shippmnets/upload-shippmnets.component';
import { ShippmentsComponent } from './components/shippments/shippments.component';
import { UiModule } from '../shared/ui/ui.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { MDBBootstrapModule, ModalModule, WavesModule, ButtonsModule, InputsModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchwizardModule } from 'angular-archwizard';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { UiSwitchModule } from 'ngx-ui-switch';
import { DetailShippmentComponent } from './components/shippments/detail-shippment/detail-shippment.component';
import { TracabiliteComponent } from './components/shippments/tracabilite/tracabilite.component';


@NgModule({
  declarations: [
    DashboardComponent,
    AddOneShippmnetComponent,
    UploadShippmnetsComponent,
    ShippmentsComponent,
    DetailShippmentComponent,
    TracabiliteComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    NgbModalModule,
    FormsModule,
    ModalModule,
    WavesModule,
    MDBBootstrapModule.forRoot(),
    InputsModule,
    ButtonsModule,
    ReactiveFormsModule,
    ArchwizardModule,
    NgSelectModule,
    NgxMaskModule.forRoot(),
    UiSwitchModule,
    UiModule
  ]
})
export class ClientModule { }
