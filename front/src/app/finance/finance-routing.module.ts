import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { InterneShipmentComponent } from '../operations/components/shipments/interne-shipment/interne-shipment.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InfoPaiementsClientComponent } from './components/info-paiements-client/info-paiements-client.component';
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {}
