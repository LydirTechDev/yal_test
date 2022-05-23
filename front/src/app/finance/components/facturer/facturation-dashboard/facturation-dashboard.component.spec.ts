import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturationDashboardComponent } from './facturation-dashboard.component';

describe('FacturationDashboardComponent', () => {
  let component: FacturationDashboardComponent;
  let fixture: ComponentFixture<FacturationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturationDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
