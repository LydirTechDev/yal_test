import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursierRoutingModule } from './coursier-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReceiveShipmentsComponent } from './components/receive-shipments/receive-shipments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListShipmentsComponent } from './components/list-shipments/list-shipments.component';
import { ListEchecsComponent } from './components/list-echecs/list-echecs.component';
import { MesPaiementsComponent } from './components/mes-paiements/mes-paiements.component';
import { DetailPaiementCoursierComponent } from './components/detail-paiement-coursier/detail-paiement-coursier.component';
import { PickupComponent } from './components/pickup/pickup.component';


@NgModule({
  declarations: [DashboardComponent, ReceiveShipmentsComponent, ListShipmentsComponent, ListEchecsComponent, MesPaiementsComponent, DetailPaiementCoursierComponent, PickupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoursierRoutingModule,
  ],
})
export class CoursierModule {}
