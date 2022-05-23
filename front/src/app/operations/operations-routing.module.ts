import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AffecterAuCoursierComponent } from './components/shipments/affecter-au-coursier/affecter-au-coursier.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateTransfertSacComponent } from './components/shipments/create-transfert-sac/create-transfert-sac.component';
import { CreateWilayaSacComponent } from './components/shipments/create-wilaya-sac/create-wilaya-sac.component';
import { EmptiedTransfertSacComponent } from './components/shipments/emptied-transfert-sac/emptied-transfert-sac.component';
import { EmptiedWilayaSacComponent } from './components/shipments/emptied-wilaya-sac/emptied-wilaya-sac.component';
import { InterneShipmentComponent } from './components/shipments/interne-shipment/interne-shipment.component';
import { ReceiveShipmentComponent } from './components/shipments/receive-shipment/receive-shipment.component';
import { ReceiveReturnsCoursierComponent } from './components/shipments/retour/receive-returns-coursier/receive-returns-coursier.component';
import { CreateTransfertSacRetourComponent } from './components/shipments/retour/create-transfert-sac-retour/create-transfert-sac-retour.component';
import { CreateWilayaSacRetourComponent } from './components/shipments/retour/create-wilaya-sac-retour/create-wilaya-sac-retour.component';
import { ViderWilayaSacRetourComponent } from './components/shipments/retour/vider-wilaya-sac-retour/vider-wilaya-sac-retour.component';
import { ViderTransfertSacRetourComponent } from './components/shipments/retour/vider-transfert-sac-retour/vider-transfert-sac-retour.component';
import { CreateAgenceSacRetourComponent } from './components/shipments/retour/create-agence-sac-retour/create-agence-sac-retour.component';
import { ViderAgenceSacRetourComponent } from './components/shipments/retour/vider-agence-sac-retour/vider-agence-sac-retour.component';
import { CreateClientSacRetourComponent } from './components/shipments/retour/create-client-sac-retour/create-client-sac-retour.component';
import { RemetreColisClientComponent } from './components/shipments/retour/remetre-colis-client/remetre-colis-client.component';
import { TransitSacComponent } from './components/shipments/transit-sac/transit-sac.component';
import { CreateAgenceSacComponent } from './components/shipments/create-agence-sac/create-agence-sac.component';
import { EmptiedAgenceSacComponent } from './components/shipments/emptied-agence-sac/emptied-agence-sac.component';
import { CreateRecolteComponent } from './components/finance/create-recolte/create-recolte.component';
import { MesRecoltesComponent } from './components/finance/mes-recoltes/mes-recoltes.component';
import { ListShipmentsComponent } from './components/shipments/list-shipments/list-shipments.component';
import { ReceiveShipmentsComponent } from '../coursier/components/receive-shipments/receive-shipments.component';
import { ListEchecsComponent } from '../coursier/components/list-echecs/list-echecs.component';
import { ListeShipmentLivraisonComponent } from './components/livraison/liste-shipment-livraison/liste-shipment-livraison.component';
import { ListeShipmentEchecLivraisonComponent } from './components/livraison/liste-shipment-echec-livraison/liste-shipment-echec-livraison.component';
import { CreateRecolteDeskComponent } from './components/finance/create-recolte-desk/create-recolte-desk.component';
import { ListSacsComponent } from './components/shipments/list-sacs/list-sacs.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'receive-shipment',
    component: ReceiveShipmentComponent,
  },
  {
    path: 'create-transfert-sac',
    component: CreateTransfertSacComponent,
  },
  {
    path: 'create-wilaya-sac',
    component: CreateWilayaSacComponent,
  },
  {
    path: 'vidé-transfert-sac',
    component: EmptiedTransfertSacComponent,
  },
  //
  {
    path: 'create-agence-sac',
    component: CreateAgenceSacComponent,
  },
  {
    path: 'vider-agence-sac',
    component: EmptiedAgenceSacComponent,
  },
  //
  {
    path: 'vidé-wilaya-sac',
    component: EmptiedWilayaSacComponent,
  },
  {
    path: 'listesacs',
    component: ListSacsComponent,
  },
  {
    path: 'interne-shipment',
    component: InterneShipmentComponent,
  },
  {
    path: 'affecter-au-coursier',
    component: AffecterAuCoursierComponent,
  },
  {
    path: 'retour/recever-retour-coursier',
    component: ReceiveReturnsCoursierComponent,
  },
  {
    path: 'retour/create-transfert-sac-retour',
    component: CreateTransfertSacRetourComponent,
  },
  {
    path: 'retour/create-wilaya-sac-retour',
    component: CreateWilayaSacRetourComponent,
  },
  {
    path: 'retour/vidé-transfert-sac-retour',
    component: ViderTransfertSacRetourComponent,
  },
  {
    path: 'retour/vidé-wilaya-sac-retour',
    component: ViderWilayaSacRetourComponent,
  },
  {
    path: 'retour/creer-agence-sac-retour',
    component: CreateAgenceSacRetourComponent,
  },
  {
    path: 'retour/vidé-agence-sac-retour',
    component: ViderAgenceSacRetourComponent,
  },
  {
    path: 'retour/creer-client-sac-retour',
    component: CreateClientSacRetourComponent,
  },
  {
    path: 'retour/remetre-au-client',
    component: RemetreColisClientComponent,
  },
  {
    path: 'transiter-sac',
    component: TransitSacComponent,
  },
  {
    path: 'cree-recolte', component: CreateRecolteComponent
  },
  {
    path: 'cree-recoltedesk', component: CreateRecolteDeskComponent
  },
  {
    path: 'mes-recoltes', component: MesRecoltesComponent
  },
  {path: 'list-shipments',
  component: ListShipmentsComponent,
  },
  {
    path: 'shipment-livraison',
    component: ListeShipmentLivraisonComponent,

  },
  {
    path: 'shipment-echec-livraison',
    component: ListeShipmentEchecLivraisonComponent,
  },
//
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationsRoutingModule {}
