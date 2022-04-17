import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcederPaiementsComponent } from './proceder-paiements.component';

describe('ProcederPaiementsComponent', () => {
  let component: ProcederPaiementsComponent;
  let fixture: ComponentFixture<ProcederPaiementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcederPaiementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcederPaiementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
