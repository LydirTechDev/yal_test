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
import { ListFactureNonPayerComponent } from './components/facturer/list-facture-non-payer/list-facture-non-payer.component';
import { ListFacturePayerComponent } from './components/facturer/list-facture-payer/list-facture-payer.component';
import { InfoRecolteComponent } from './components/info-recolte/info-recolte.component';
import { DetailFactureClassiqueComponent } from './components/facturer/detail-facture-classique/detail-facture-classique.component';
import { FacturerECommerceComponent } from './components/facturer/facturer-e-commerce/facturer-e-commerce.component';
import { FacturerClassiqueComponent } from './components/facturer/facturer-classique/facturer-classique.component';
import { ListFactureEcommerceComponent } from './components/facturer/list-facture-ecommerce/list-facture-ecommerce.component';
import { DetailFactureEcommerceComponent } from './components/facturer/detail-facture-ecommerce/detail-facture-ecommerce.component';
import { FacturationDashboardComponent } from './components/facturer/facturation-dashboard/facturation-dashboard.component';
import { FacturerZeroComponent } from './components/facturer/facturer-zero/facturer-zero.component';
import { ListFactureZeroNonPayerComponent } from './components/facturer/list-facture-zero-non-payer/list-facture-zero-non-payer.component';
import { ListFactureZeroPayerComponent } from './components/facturer/list-facture-zero-payer/list-facture-zero-payer.component';

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
    InfoRecolteComponent,
    ListFactureNonPayerComponent,
    ListFacturePayerComponent,
    DetailFactureClassiqueComponent,
    FacturerECommerceComponent,
    FacturerClassiqueComponent,
    ListFactureEcommerceComponent,
    DetailFactureEcommerceComponent,
    FacturationDashboardComponent,
    FacturerZeroComponent,
    ListFactureZeroNonPayerComponent,
    ListFactureZeroPayerComponent
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
