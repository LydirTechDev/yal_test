import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFactureEcommerceComponent } from './list-facture-ecommerce.component';

describe('ListFactureEcommerceComponent', () => {
  let component: ListFactureEcommerceComponent;
  let fixture: ComponentFixture<ListFactureEcommerceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFactureEcommerceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFactureEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
