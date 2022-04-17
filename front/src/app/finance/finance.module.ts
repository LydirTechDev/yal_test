import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReceiveRecoltesComponent } from './components/receive-recoltes/receive-recoltes.component';
import { ButtonsModule } from 'angular-bootstrap-md';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListRecoltesComponent } from './components/list-recoltes/list-recoltes.component';
import { LibererPaimentsComponent } from './components/liberer-paiments/liberer-paiments.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProcederPaiementsComponent } from './components/proceder-paiements/proceder-paiements.component';
import { SharedModule } from '../shared/shared.module';
import { UiModule } from '../shared/ui/ui.module';
import { InfoPaiementsClientComponent } from './components/info-paiements-client/info-paiements-client.component';
import { ListPaiementsComponent } from './components/list-paiements/list-paiements.component';
import { PayerCoursierComponent } from './components/payer-coursier/payer-coursier.component';
import { ListPaiementCoursierComponent } from './components/list-paiement-coursier/list-paiement-coursier.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ReceiveRecoltesComponent,
    ListRecoltesComponent,
    LibererPaimentsComponent,
    ProcederPaiementsComponent,
    InfoPaiementsClientComponent,
    ListPaiementsComponent,
    PayerCoursierComponent,
    ListPaiementCoursierComponent,
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonsModule,
    NgSelectModule,
    SharedModule,
    UiModule
  ],
})
export class FinanceModule {}
