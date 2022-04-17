import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { VerticalComponent } from './vertical/vertical.component';
import { HorizontalComponent } from './horizontal/horizontal.component';
import { LayoutComponent } from './layout/layout.component';
import { ButtonsModule, InputsModule, MDBBootstrapModule, WavesModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [VerticalComponent, HorizontalComponent, LayoutComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MDBBootstrapModule.forRoot(),
    ButtonsModule,
    InputsModule,
    WavesModule,
  ],
  exports: [VerticalComponent, HorizontalComponent]
})
export class LayoutsModule { }
