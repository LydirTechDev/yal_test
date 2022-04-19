import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPaiementComponent } from './detail-paiement.component';

describe('DetailPaiementComponent', () => {
  let component: DetailPaiementComponent;
  let fixture: ComponentFixture<DetailPaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPaiementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
