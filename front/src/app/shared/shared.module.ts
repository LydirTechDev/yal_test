import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiModule } from './ui/ui.module';
import { ResultSearchTrackingComponent } from './result-search-tracking/result-search-tracking.component';

@NgModule({
  declarations: [
    ResultSearchTrackingComponent
  ],
  imports: [
    CommonModule,
    UiModule
  ]
})
export class SharedModule { }
