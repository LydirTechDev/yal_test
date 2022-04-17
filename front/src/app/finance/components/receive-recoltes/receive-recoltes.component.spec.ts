import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveRecoltesComponent } from './receive-recoltes.component';

describe('ReceiveRecoltesComponent', () => {
  let component: ReceiveRecoltesComponent;
  let fixture: ComponentFixture<ReceiveRecoltesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveRecoltesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveRecoltesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
