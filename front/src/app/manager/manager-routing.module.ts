import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StatistiqueParStatusFinanceComponent } from './components/statistique-par-status-finance/statistique-par-status-finance.component';
import { StatistiqueParStatusOpsComponent } from './components/statistique-par-status-ops/statistique-par-status-ops.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent},
      {
        path: 'statistiqueOPS',
    component: StatistiqueParStatusOpsComponent,
  },
  {
    path: 'statistiqueFinance',
    component: StatistiqueParStatusFinanceComponent,
  },
  ]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
