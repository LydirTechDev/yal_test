import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeShipmentEchecLivraisonComponent } from './liste-shipment-echec-livraison.component';

describe('ListeShipmentEchecLivraisonComponent', () => {
  let component: ListeShipmentEchecLivraisonComponent;
  let fixture: ComponentFixture<ListeShipmentEchecLivraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeShipmentEchecLivraisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeShipmentEchecLivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
