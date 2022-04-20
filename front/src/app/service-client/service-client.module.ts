import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceClientRoutingModule } from './service-client-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateClassiqueShipmentComponent } from './create-classique-shipment/create-classique-shipment.component';
import { CreateCahierDeChargeShipmentComponent } from './create-cahier-de-charge-shipment/create-cahier-de-charge-shipment.component';
import { CreateSoumissionShipmentComponent } from './create-soumission-shipment/create-soumission-shipment.component';
import { HttpClientModule } from '@angular/common/http';
import { UiSwitchModule } from 'ngx-ui-switch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { CreateRecolteCsComponent } from './create-recolte-desk/create-recolte-cs.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CreateClassiqueShipmentComponent,
    CreateCahierDeChargeShipmentComponent,
    CreateSoumissionShipmentComponent,
    CreateRecolteCsComponent,
  ],
  imports: [
    CommonModule,
    UiSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxMaskModule.forRoot(),
    ServiceClientRoutingModule,
  ],
})
export class ServiceClientModule {}
