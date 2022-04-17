import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViderAgenceSacRetourComponent } from './vider-agence-sac-retour.component';

describe('ViderAgenceSacRetourComponent', () => {
  let component: ViderAgenceSacRetourComponent;
  let fixture: ComponentFixture<ViderAgenceSacRetourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViderAgenceSacRetourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViderAgenceSacRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
