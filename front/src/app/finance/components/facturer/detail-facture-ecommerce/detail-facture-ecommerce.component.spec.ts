import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFactureEcommerceComponent } from './detail-facture-ecommerce.component';

describe('DetailFactureEcommerceComponent', () => {
  let component: DetailFactureEcommerceComponent;
  let fixture: ComponentFixture<DetailFactureEcommerceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailFactureEcommerceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFactureEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
