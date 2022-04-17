import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtrapagesRoutingModule } from './extrapages-routing.module';
import { NotFound404Component } from './not-found404/not-found404.component';
import { InternalSE500Component } from './internal-se500/internal-se500.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { ComingsoonComponent } from './comingsoon/comingsoon.component';


@NgModule({
  declarations: [
    NotFound404Component,
    InternalSE500Component,
    MaintenanceComponent,
    LockscreenComponent,
    ComingsoonComponent
  ],
  imports: [
    CommonModule,
    ExtrapagesRoutingModule
  ]
})
export class ExtrapagesModule { }
