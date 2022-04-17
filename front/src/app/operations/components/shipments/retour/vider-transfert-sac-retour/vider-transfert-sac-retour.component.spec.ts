import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViderTransfertSacRetourComponent } from './vider-transfert-sac-retour.component';

describe('ViderTransfertSacRetourComponent', () => {
  let component: ViderTransfertSacRetourComponent;
  let fixture: ComponentFixture<ViderTransfertSacRetourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViderTransfertSacRetourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViderTransfertSacRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
