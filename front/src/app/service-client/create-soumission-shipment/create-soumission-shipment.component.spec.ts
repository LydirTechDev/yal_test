import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSoumissionShipmentComponent } from './create-soumission-shipment.component';

describe('CreateSoumissionShipmentComponent', () => {
  let component: CreateSoumissionShipmentComponent;
  let fixture: ComponentFixture<CreateSoumissionShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSoumissionShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSoumissionShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
