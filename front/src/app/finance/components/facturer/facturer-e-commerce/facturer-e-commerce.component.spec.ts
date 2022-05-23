import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturerECommerceComponent } from './facturer-e-commerce.component';

describe('FacturerECommerceComponent', () => {
  let component: FacturerECommerceComponent;
  let fixture: ComponentFixture<FacturerECommerceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturerECommerceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturerECommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
