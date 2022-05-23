import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationsRoutingModule } from './operations-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReceiveShipmentComponent } from './components/shipments/receive-shipment/receive-shipment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { WavesModule, MDBBootstrapModule, InputsModule, ButtonsModule } from 'angular-bootstrap-md';
import { UiSwitchModule } from 'ngx-ui-switch';
import { UiModule } from '../shared/ui/ui.module';
import { CreateTransfertSacComponent } from './components/shipments/create-transfert-sac/create-transfert-sac.component';
import { CreateWilayaSacComponent } from './components/shipments/create-wilaya-sac/create-wilaya-sac.component';
import { EmptiedTransfertSacComponent } from './components/shipments/emptied-transfert-sac/emptied-transfert-sac.component';
import { EmptiedWilayaSacComponent } from './components/shipments/emptied-wilaya-sac/emptied-wilaya-sac.component';
import { InterneShipmentComponent } from './components/shipments/interne-shipment/interne-shipment.component';
import { AffecterAuCoursierComponent } from './components/shipments/affecter-au-coursier/affecter-au-coursier.component';
import { ReceiveReturnsCoursierComponent } from './components/shipments/retour/receive-returns-coursier/receive-returns-coursier.component';
import { CreateTransfertSacRetourComponent } from './components/shipments/retour/create-transfert-sac-retour/create-transfert-sac-retour.component';
import { CreateWilayaSacRetourComponent } from './components/shipments/retour/create-wilaya-sac-retour/create-wilaya-sac-retour.component';
import { CreateAgenceSacRetourComponent } from './components/shipments/retour/create-agence-sac-retour/create-agence-sac-retour.component';
import { CreateClientSacRetourComponent } from './components/shipments/retour/create-client-sac-retour/create-client-sac-retour.component';
import { ViderAgenceSacRetourComponent } from './components/shipments/retour/vider-agence-sac-retour/vider-agence-sac-retour.component';
import { ViderWilayaSacRetourComponent } from './components/shipments/retour/vider-wilaya-sac-retour/vider-wilaya-sac-retour.component';
import { RemetreColisClientComponent } from './components/shipments/retour/remetre-colis-client/remetre-colis-client.component';
import { ViderTransfertSacRetourComponent } from './components/shipments/retour/vider-transfert-sac-retour/vider-transfert-sac-retour.component';
import { TransitSacComponent } from './components/shipments/transit-sac/transit-sac.component';
import { CreateAgenceSacComponent } from './components/shipments/create-agence-sac/create-agence-sac.component';
import { EmptiedAgenceSacComponent } from './components/shipments/emptied-agence-sac/emptied-agence-sac.component';
import { CreateRecolteComponent } from './components/finance/create-recolte/create-recolte.component';
import { MesRecoltesComponent } from './components/finance/mes-recoltes/mes-recoltes.component';
import { ListShipmentsComponent } from './components/shipments/list-shipments/list-shipments.component';
import { ListeShipmentLivraisonComponent } from './components/livraison/liste-shipment-livraison/liste-shipment-livraison.component';
import { ListeShipmentEchecLivraisonComponent } from './components/livraison/liste-shipment-echec-livraison/liste-shipment-echec-livraison.component';
import { CreateRecolteDeskComponent } from './components/finance/create-recolte-desk/create-recolte-desk.component';
import { ListSacsComponent } from './components/shipments/list-sacs/list-sacs.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ReceiveShipmentComponent,
    CreateTransfertSacComponent,
    CreateWilayaSacComponent,
    EmptiedTransfertSacComponent,
    EmptiedWilayaSacComponent,
    InterneShipmentComponent,
    AffecterAuCoursierComponent,
    ReceiveReturnsCoursierComponent,
    CreateTransfertSacRetourComponent,
    CreateWilayaSacRetourComponent,
    CreateAgenceSacRetourComponent,
    CreateClientSacRetourComponent,
    ViderAgenceSacRetourComponent,
    ViderWilayaSacRetourComponent,
    RemetreColisClientComponent,
    ViderTransfertSacRetourComponent,
    TransitSacComponent,
    CreateAgenceSacComponent,
    EmptiedAgenceSacComponent,
    CreateRecolteComponent,
    MesRecoltesComponent,
    ListShipmentsComponent,
    ListeShipmentLivraisonComponent,
    ListeShipmentEchecLivraisonComponent,
    CreateRecolteDeskComponent,
    ListSacsComponent
  ],
  imports: [
    CommonModule,
    OperationsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModalModule,
    WavesModule,
    MDBBootstrapModule.forRoot(),
    InputsModule,
    ButtonsModule,
    NgSelectModule,
    UiSwitchModule,
    UiModule
  ]
})
export class OperationsModule { }
