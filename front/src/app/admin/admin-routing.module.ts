import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgenceComponent } from './agence/agence.component';
import { DetailAgenceComponent } from './agence/detail-agence/detail-agence.component';
import { AjouterClientComponent } from './clients/ajouter-client/ajouter-client.component';
import { ClientsComponent } from './clients/clients.component';
import { DetailClientComponent } from './clients/detail-client/detail-client.component';
import { CommuneComponent } from './commune/commune.component';
import { DetailCommuneComponent } from './commune/detail-commune/detail-commune.component';
import { AjouterCoursierComponent } from './coursier/ajouter-coursier/ajouter-coursier.component';
import { CoursierComponent } from './coursier/coursier.component';
import { DetailCoursierComponent } from './coursier/detail-coursier/detail-coursier.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AjouterEmployeComponent } from './employe/ajouter-employe/ajouter-employe.component';
import { DetailEmployeComponent } from './employe/detail-employe/detail-employe.component';
import { EmployeComponent } from './employe/employe.component';
import { PlagesPoidsComponent } from './plages-poids/plages-poids.component';
import { DetailRotationComponent } from './rotations/detail-rotation/detail-rotation.component';
import { RotationsComponent } from './rotations/rotations.component';
import { CodeTarifDetailComponent } from './tarifications/code-tarif-detail/code-tarif-detail.component';
import { CreateServiceComponent } from './tarifications/create-service/create-service.component';
import { LandingTarificationComponent } from './tarifications/landing-tarification/landing-tarification.component';
import { ServiceDetailComponent } from './tarifications/service-detail/service-detail.component';
import { TarificationsComponent } from './tarifications/tarifications.component';
import { UsersComponent } from './users/users.component';
import { DetailWilayaComponent } from './wilaya/detail-wilaya/detail-wilaya.component';
import { WilayaComponent } from './wilaya/wilaya.component';
import { ZoneComponent } from './zone/zone.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'wilaya',
    component: WilayaComponent,
    data: { title: 'Gestion des wilayas' },
  },
  {
    path: 'commune',
    component: CommuneComponent,
    data: { title: 'Gestion des Communes' },
  },
  {
    path: 'agence',
    component: AgenceComponent,
    data: { title: 'Gestion des Agence' },
  },
  {
    path: 'zones',
    component: ZoneComponent,
    data: { title: 'Gestion des Zone' },
  },
  {
    path: 'rotations',
    component: RotationsComponent,
    data: { title: 'Gestion des Zone' },
  },
  {
    path: 'users',
    component: UsersComponent,
    data: { title: 'Gestion des Utilisateurs' },
  },
  // {
  //   path: 'plages-poids',
  //   component: PlagesPoidsComponent
  // }
  {
    path: 'tarifications',
    component: TarificationsComponent,
    children: [
      {
        path: '',
        component: LandingTarificationComponent
      },
      {
        path: 'create-new-service',
        component: CreateServiceComponent,
      },
      {
        path: 'detail-service/:id',
        component: ServiceDetailComponent
      },
      {
        path: 'detail-code-tarif/:id',
        component: CodeTarifDetailComponent
      }
    ],
  },

  {
    path: 'agence/detail_agence/:id',
    component: DetailAgenceComponent
  },

  {
    path: 'rotation/detail_rotation/:id',
    component: DetailRotationComponent
  },

  {
    path: 'commune/detail_commune/:id',
    component: DetailCommuneComponent
  },

  {
    path: 'wilaya/detail_wilaya/:id',
    component: DetailWilayaComponent
  },
  {
    path: 'coursier',
    component: CoursierComponent,
    data: { title: 'Gestion des coursier' },
  },
  {
    path: 'coursier/ajouter_coursier',
    component: AjouterCoursierComponent,
    data: { title: 'Gestion des coursier' },
  },
  {
    path: 'coursier/detail_coursier/:id',
    component: DetailCoursierComponent,
    data: { title: 'detail de coursier' },
  },
  {
    path: 'employé',
    component: EmployeComponent,
    data: { title: 'Gestion des employés' },
  },
  {
    path: 'employé/ajouter_employé',
    component: AjouterEmployeComponent,
    data: { title: 'Gestion des coursier' },
  },

  {
    path: 'employé/detail_employé/:id',
    component: DetailEmployeComponent,
    data: { title: "detail d'employé " },
  },
  {
    path: 'client',
    component: ClientsComponent,
    data: { title: "gestion des clients " },
  },

  {
    path: 'client/ajouter_client',
    component: AjouterClientComponent,
    data: { title: "Ajouter client " },
  },

  {
    path: 'client/detail_client/:id',
    component: DetailClientComponent,
    data: { title: "detail de client" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
