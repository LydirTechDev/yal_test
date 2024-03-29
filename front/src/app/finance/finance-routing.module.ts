import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { DetailPaiementCoursierComponent } from '../coursier/components/detail-paiement-coursier/detail-paiement-coursier.component';
import { InterneShipmentComponent } from '../operations/components/shipments/interne-shipment/interne-shipment.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DetailFactureClassiqueComponent } from './components/facturer/detail-facture-classique/detail-facture-classique.component';
import { DetailFactureEcommerceComponent } from './components/facturer/detail-facture-ecommerce/detail-facture-ecommerce.component';
import { FacturationDashboardComponent } from './components/facturer/facturation-dashboard/facturation-dashboard.component';
import { FacturerClassiqueComponent } from './components/facturer/facturer-classique/facturer-classique.component';
import { FacturerECommerceComponent } from './components/facturer/facturer-e-commerce/facturer-e-commerce.component';
import { ListFactureEcommerceComponent } from './components/facturer/list-facture-ecommerce/list-facture-ecommerce.component';
import { ListFactureNonPayerComponent } from './components/facturer/list-facture-non-payer/list-facture-non-payer.component';
import { ListFacturePayerComponent } from './components/facturer/list-facture-payer/list-facture-payer.component';
import { ListRecolteFactureComponent } from './components/facturer/list-recolte-facture/list-recolte-facture.component';
import { ListRecolteRegularisationComponent } from './components/facturer/list-recolte-regularisation/list-recolte-regularisation.component';
import { RecolteFactureComponent } from './components/facturer/recolte-facture/recolte-facture.component';
import { RecolteRegularisationComponent } from './components/facturer/recolte-regularisation/recolte-regularisation.component';
import { RegularisationComponent } from './components/facturer/regularisation/regularisation.component';
import { InfoPaiementsClientComponent } from './components/info-paiements-client/info-paiements-client.component';
import { InfoRecolteComponent } from './components/info-recolte/info-recolte.component';
import { LibererPaimentsComponent } from './components/liberer-paiments/liberer-paiments.component';
import { ListPaiementCoursierComponent } from './components/list-paiement-coursier/list-paiement-coursier.component';
import { ListPaiementsComponent } from './components/list-paiements/list-paiements.component';
import { ListRecoltesComponent } from './components/list-recoltes/list-recoltes.component';
import { PayerCoursierComponent } from './components/payer-coursier/payer-coursier.component';
import { ProcederPaiementsComponent } from './components/proceder-paiements/proceder-paiements.component';
import { ReceiveRecoltesComponent } from './components/receive-recoltes/receive-recoltes.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'interne-shipment',
    component: InterneShipmentComponent,
  },
  {
    path: 'recever-recoltes',
    component: ReceiveRecoltesComponent,
  },
  {
    path: 'liste-recoltes',
    component: ListRecoltesComponent,
  },
  {
    path: 'liberer-paiement',
    component: LibererPaimentsComponent,
  },
  {
    path: 'payer-coursier',
    component: PayerCoursierComponent,
  },
  {
    path: 'list-paiements-coursier',
    component: ListPaiementCoursierComponent,
  },
  {path: 'detail-list-paiement/:id',
  component: DetailPaiementCoursierComponent}
  ,
  {
    path: 'recolte/:id',
    component: InfoRecolteComponent
  }
  ,
  {
    path: 'proceder-paiement',
    children: [
      {
        path: '',
        component: ProcederPaiementsComponent,
      },
      {
        path: ':id',
        component: InfoPaiementsClientComponent
      }
    ],
  },
  {
    path: 'list-paiements',
    component: ListPaiementsComponent,
  },
  {
    path: 'facturer-classique',
    component: FacturerClassiqueComponent,
    data: { title: "gestion des facture " },
  },
  {
    path: 'list-facture-payer',
    component: ListFacturePayerComponent,
    data: { title: "gestion des facture payées " },
  },
  {
    path: 'list-facture-non-payer',
    component: ListFactureNonPayerComponent,
    data: { title: "gestion des facture non payées " },
  },
  {
    path: 'facture/detail-facture-classique/:id',
    component: DetailFactureClassiqueComponent,
    data: { title: "detail facture " },
  },

  {
    path: 'facturer-e-commerce',
    component: FacturerECommerceComponent,
    data: { title: "detail facture " },
  },

  {
    path: 'list-factures-e-commerce',
    component: ListFactureEcommerceComponent,
    data: { title: "detail facture " },
  },

  {
    path: 'facture/detail-facture-ecommerce/:id',
    component: DetailFactureEcommerceComponent,
    data: { title: "detail facture " },
  },

  {
    path: 'facturation/dashboard',
    component: FacturationDashboardComponent,
    data: { title: "detail facture " },
  },


  {
    path: 'facturation/regularisation',
    component: RegularisationComponent,
    data: { title: "régulariser " },
  },

  {
    path: 'facturation/recolte-regularisation',
    component: RecolteRegularisationComponent,
    data: { title: "récolte-régularisation " },
  },

  {
    path: 'facturation/list-recolte-regularisation',
    component: ListRecolteRegularisationComponent,
    data: { title: "récolte-régularisation " },
  },

  {
    path: 'facturation/recolte-facture',
    component: RecolteFactureComponent,
    data: { title: "récolte-facture " },
  },

  {
    path: 'facturation/list-recolte-facture',
    component: ListRecolteFactureComponent,
    data: { title: "récolte-régularisation " },
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {}
