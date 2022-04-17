import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { AlertsComponent } from './alerts/alerts.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [PagetitleComponent, AlertsComponent],
  imports: [
    CommonModule,
    NgbAlertModule
  ],
  exports: [PagetitleComponent]
})
export class UiModule { }
