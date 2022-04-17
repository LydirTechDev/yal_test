import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveShipmentComponent } from './receive-shipment.component';

describe('ReceiveShipmentComponent', () => {
  let component: ReceiveShipmentComponent;
  let fixture: ComponentFixture<ReceiveShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
