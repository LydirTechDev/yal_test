import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesRecoltesComponent } from './mes-recoltes.component';

describe('MesRecoltesComponent', () => {
  let component: MesRecoltesComponent;
  let fixture: ComponentFixture<MesRecoltesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesRecoltesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesRecoltesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
