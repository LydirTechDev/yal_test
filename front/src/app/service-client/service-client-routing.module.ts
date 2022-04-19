import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCahierDeChargeShipmentComponent } from './create-cahier-de-charge-shipment/create-cahier-de-charge-shipment.component';
import { CreateClassiqueShipmentComponent } from './create-classique-shipment/create-classique-shipment.component';
import { CreateSoumissionShipmentComponent } from './create-soumission-shipment/create-soumission-shipment.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceClientRoutingModule {}
