import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiqueParStatusFinanceComponent } from './statistique-par-status-finance.component';

describe('StatistiqueParStatusFinanceComponent', () => {
  let component: StatistiqueParStatusFinanceComponent;
  let fixture: ComponentFixture<StatistiqueParStatusFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatistiqueParStatusFinanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatistiqueParStatusFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
