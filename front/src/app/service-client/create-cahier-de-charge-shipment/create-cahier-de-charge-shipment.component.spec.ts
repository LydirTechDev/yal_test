import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCahierDeChargeShipmentComponent } from './create-cahier-de-charge-shipment.component';

describe('CreateCahierDeChargeShipmentComponent', () => {
  let component: CreateCahierDeChargeShipmentComponent;
  let fixture: ComponentFixture<CreateCahierDeChargeShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCahierDeChargeShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCahierDeChargeShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
