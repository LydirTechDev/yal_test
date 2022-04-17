import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {
  NgbAccordionModule,
  NgbDropdownModule,
  NgbPaginationModule,
  NgbProgressbarModule,
  NgbTooltipModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { WilayaComponent } from './wilaya/wilaya.component';
import { CommuneComponent } from './commune/commune.component';
import { AgenceComponent } from './agence/agence.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArchwizardModule } from 'angular-archwizard';
import { UiSwitchModule } from 'ngx-ui-switch';
import { WilayaService } from './wilaya/wilaya.service';
import { CommuneService } from './commune/commune.service';
import { AgenceService } from './agence/agence.service';
import { ZoneComponent } from './zone/zone.component';
import { AddZoneComponent } from './zone/add-zone/add-zone.component';
import { RotationsComponent } from './rotations/rotations.component';
import { UsersComponent } from './users/users.component';
import { ModalModule } from 'angular-bootstrap-md';
import { PlagesPoidsComponent } from './plages-poids/plages-poids.component';
import { Ng5SliderModule } from 'ng5-slider';
import { TarificationsComponent } from './tarifications/tarifications.component';
import { CreateServiceComponent } from './tarifications/create-service/create-service.component';
import { LandingTarificationComponent } from './tarifications/landing-tarification/landing-tarification.component';
import { ServiceDetailComponent } from './tarifications/service-detail/service-detail.component';
import { CodeTarifDetailComponent } from './tarifications/code-tarif-detail/code-tarif-detail.component';
import { ServiceListComponent } from './tarifications/service-list/service-list.component';
import { DetailWilayaComponent } from './wilaya/detail-wilaya/detail-wilaya.component';
import { DetailCommuneComponent } from './commune/detail-commune/detail-commune.component';
import { DetailAgenceComponent } from './agence/detail-agence/detail-agence.component';
import { DetailRotationComponent } from './rotations/detail-rotation/detail-rotation.component';
import { CoursierComponent } from './coursier/coursier.component';
import { AjouterCoursierComponent } from './coursier/ajouter-coursier/ajouter-coursier.component';
import { DetailCoursierComponent } from './coursier/detail-coursier/detail-coursier.component';
import { NgxMaskModule } from 'ngx-mask';
import { EmployeComponent } from './employe/employe.component';
import { AjouterEmployeComponent } from './employe/ajouter-employe/ajouter-employe.component';
import { DetailEmployeComponent } from './employe/detail-employe/detail-employe.component';
import { ClientsComponent } from './clients/clients.component';
import { AjouterClientComponent } from './clients/ajouter-client/ajouter-client.component';
import { DetailClientComponent } from './clients/detail-client/detail-client.component';
import { CreateCodeTarifComponent } from './tarifications/create-code-tarif/create-code-tarif.component';

@NgModule({
  declarations: [
    DashboardComponent,
    WilayaComponent,
    CommuneComponent,
    AgenceComponent,
    ZoneComponent,
    AddZoneComponent,
    RotationsComponent,
    UsersComponent,
    PlagesPoidsComponent,
    TarificationsComponent,
    CreateServiceComponent,
    LandingTarificationComponent,
    ServiceDetailComponent,
    CodeTarifDetailComponent,
    ServiceListComponent,
    DetailWilayaComponent,
    DetailCommuneComponent,
    DetailAgenceComponent,
    DetailRotationComponent,
    CoursierComponent,
    AjouterCoursierComponent,
    DetailCoursierComponent,
    EmployeComponent,
    AjouterEmployeComponent,
    DetailEmployeComponent,
    ClientsComponent,
    AjouterClientComponent,
    DetailClientComponent,
    CreateCodeTarifComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    UiModule,
    SharedModule,
    PerfectScrollbarModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbProgressbarModule,
    ReactiveFormsModule,
    NgSelectModule,
    ArchwizardModule,
    UiSwitchModule,
    NgbTooltipModule,
    ModalModule,
    Ng5SliderModule,
    NgbAccordionModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [WilayaService, CommuneService, DecimalPipe, AgenceService],
})
export class AdminModule {}
