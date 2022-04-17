import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViderWilayaSacRetourComponent } from './vider-wilaya-sac-retour.component';

describe('ViderWilayaSacRetourComponent', () => {
  let component: ViderWilayaSacRetourComponent;
  let fixture: ComponentFixture<ViderWilayaSacRetourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViderWilayaSacRetourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViderWilayaSacRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
