import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { LayoutComponent } from '../layouts/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DetailPaiementComponent } from './components/detail-paiement/detail-paiement.component';
import { PaiementsClientComponent } from './components/paiements-client/paiements-client.component';
import { DetailShippmentComponent } from './components/shippments/detail-shippment/detail-shippment.component';
import { ShippmentsComponent } from './components/shippments/shippments.component';
import { TracabiliteComponent } from './components/shippments/tracabilite/tracabilite.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard' , canActivate:[AuthGuard]},
  { path: 'dashboard', component: DashboardComponent , canActivate:[AuthGuard]},
  { path: 'colis', component: ShippmentsComponent, canActivate:[AuthGuard]},
  { path: 'colis/tracabilite', component: TracabiliteComponent, canActivate: [AuthGuard] },
  { path: 'colis/:id', component: DetailShippmentComponent, canActivate:[AuthGuard]},
  { path: 'paiementclient', component: PaiementsClientComponent, canActivate: [AuthGuard] },
  { path: 'paiement/:id', component: DetailPaiementComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
