import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClassiqueShipmentComponent } from './create-classique-shipment.component';

describe('CreateClassiqueShipmentComponent', () => {
  let component: CreateClassiqueShipmentComponent;
  let fixture: ComponentFixture<CreateClassiqueShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateClassiqueShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClassiqueShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
