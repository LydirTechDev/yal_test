import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCahierDeChargeShipmentComponent } from './create-cahier-de-charge-shipment/create-cahier-de-charge-shipment.component';
import { CreateClassiqueShipmentComponent } from './create-classique-shipment/create-classique-shipment.component';
import { CreateRecolteCsComponent } from './create-recolte-desk/create-recolte-cs.component';
import { CreateSoumissionShipmentComponent } from './create-soumission-shipment/create-soumission-shipment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListShipmentsComponent } from './list-shipments/list-shipments.component';
import { ListeRecolteComponent } from './liste-recolte/liste-recolte.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'classique',
    component: CreateClassiqueShipmentComponent,
  },
  {
    path: 'retrait-cahier-de-charge',
    component: CreateCahierDeChargeShipmentComponent,
  },
  {
    path: 'soumission',
    component: CreateSoumissionShipmentComponent,
  },
  {
    path: 'cree-recolte',
    component: CreateRecolteCsComponent,
  },
  {
    path: 'liste-recolte',
    component: ListeRecolteComponent
  },
  {
    path: 'liste-shipments',
    component: ListShipmentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceClientRoutingModule {}
