import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListEchecsComponent } from './components/list-echecs/list-echecs.component';
import { ListShipmentsComponent } from './components/list-shipments/list-shipments.component';
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursierRoutingModule {}
