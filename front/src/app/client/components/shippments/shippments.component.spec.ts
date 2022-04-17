import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippmentsComponent } from './shippments.component';

describe('ShippmentsComponent', () => {
  let component: ShippmentsComponent;
  let fixture: ComponentFixture<ShippmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
