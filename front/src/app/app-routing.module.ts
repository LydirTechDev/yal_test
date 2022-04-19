import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';
import { NotFound404Component } from './extrapages/not-found404/not-found404.component';
import { LayoutComponent } from './layouts/layout/layout.component';
import { ResultSearchTrackingComponent } from './shared/result-search-tracking/result-search-tracking.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'client',
    component: LayoutComponent,
    loadChildren: () =>
      import('./client/client.module').then((m) => m.ClientModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'operations',
    component: LayoutComponent,
    loadChildren: () =>
      import('./operations/operations.module').then((m) => m.OperationsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'coursier',
    component: LayoutComponent,
    loadChildren: () =>
      import('./coursier/coursier.module').then((m) => m.CoursierModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    component: LayoutComponent,
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'finance',
    component: LayoutComponent,
    loadChildren: () =>
      import('./finance/finance.module').then((m) => m.FinanceModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'recherche/:tracking',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ResultSearchTrackingComponent,
      },
    ],
  },
  {
    path: 'service-client',
    component: LayoutComponent,
    loadChildren: () =>
      import('./service-client/service-client.module').then(
        (m) => m.ServiceClientModule
      ),
  },
  {
    path: '**',
    component: NotFound404Component,
    data: { title: 'Page Not Found' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
