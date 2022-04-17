import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerCoursierComponent } from './payer-coursier.component';

describe('PayerCoursierComponent', () => {
  let component: PayerCoursierComponent;
  let fixture: ComponentFixture<PayerCoursierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayerCoursierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayerCoursierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
