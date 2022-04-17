import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DetailShippmentComponent } from './components/shippments/detail-shippment/detail-shippment.component';
import { ShippmentsComponent } from './components/shippments/shippments.component';
import { TracabiliteComponent } from './components/shippments/tracabilite/tracabilite.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard' , canActivate:[AuthGuard]},
  { path: 'dashboard', component: DashboardComponent , canActivate:[AuthGuard]},
  { path: 'colis', component: ShippmentsComponent, canActivate:[AuthGuard]},
  { path: 'colis/tracabilite', component: TracabiliteComponent, canActivate: [AuthGuard] },
  { path: 'colis/:id', component: DetailShippmentComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
