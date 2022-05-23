import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
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
import { PaiementsClientComponent } from './components/paiements-client/paiements-client.component';
import { DetailPaiementComponent } from './components/detail-paiement/detail-paiement.component';
import { ParametrageClientComponent } from './components/parametrage-client/parametrage-client.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ShippmentsComponent,
    DetailShippmentComponent,
    TracabiliteComponent,
    PaiementsClientComponent,
    DetailPaiementComponent,
    ParametrageClientComponent
  ],
  imports: [
    NgxMaskModule.forRoot(),
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
