import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeShipmentLivraisonComponent } from './liste-shipment-livraison.component';

describe('ListeShipmentLivraisonComponent', () => {
  let component: ListeShipmentLivraisonComponent;
  let fixture: ComponentFixture<ListeShipmentLivraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeShipmentLivraisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeShipmentLivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
