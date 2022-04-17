import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOneShippmnetComponent } from './add-one-shippmnet.component';

describe('AddOneShippmnetComponent', () => {
  let component: AddOneShippmnetComponent;
  let fixture: ComponentFixture<AddOneShippmnetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOneShippmnetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOneShippmnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
