import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPaiementCoursierComponent } from './detail-paiement-coursier.component';

describe('DetailPaiementCoursierComponent', () => {
  let component: DetailPaiementCoursierComponent;
  let fixture: ComponentFixture<DetailPaiementCoursierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPaiementCoursierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPaiementCoursierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
