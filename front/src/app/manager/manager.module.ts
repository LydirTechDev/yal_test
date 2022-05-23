import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonsModule } from 'angular-bootstrap-md';
import { StatistiqueParStatusOpsComponent } from './components/statistique-par-status-ops/statistique-par-status-ops.component';
import { StatistiqueParStatusFinanceComponent } from './components/statistique-par-status-finance/statistique-par-status-finance.component';


@NgModule({
  declarations: [
    DashboardComponent,
    StatistiqueParStatusOpsComponent,
    StatistiqueParStatusFinanceComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonsModule,
    NgSelectModule,
  ]
})
export class ManagerModule { }
