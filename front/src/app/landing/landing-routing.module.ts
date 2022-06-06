import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AProposComponent } from './a-propos/a-propos.component';
import { ContactComponent } from './contact/contact.component';
import { NosServicesComponent } from './nos-services/nos-services.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

const routes: Routes = [
  {
    path: '', component: WelcomePageComponent
  },
  { path: 'services', component: NosServicesComponent },
  { path: 'apropos', component: AProposComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'suivre/:tracking',
    component: SearchResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
