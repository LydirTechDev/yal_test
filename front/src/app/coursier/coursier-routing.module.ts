import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DetailPaiementCoursierComponent } from './components/detail-paiement-coursier/detail-paiement-coursier.component';
import { ListEchecsComponent } from './components/list-echecs/list-echecs.component';
import { ListShipmentsComponent } from './components/list-shipments/list-shipments.component';
import { MesPaiementsComponent } from './components/mes-paiements/mes-paiements.component';
import { PickupComponent } from './components/pickup/pickup.component';
import { ReceiveShipmentsComponent } from './components/receive-shipments/receive-shipments.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'receve-shipments',
    component: ReceiveShipmentsComponent,
  },
  {
    path: 'shipment-of-coursier-a-livrer',
    component: ListShipmentsComponent,
  },
  {
    path: 'shipment-echec-coursier',
    component: ListEchecsComponent,
  },
  {
    path: 'list-paiement-coursier',
    component: MesPaiementsComponent,
  },
  {
    path: 'detail-list-paiement/:id',
    component: DetailPaiementCoursierComponent,
  },
  {
    path: 'pickup-coursier',
    component: PickupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursierRoutingModule {}
