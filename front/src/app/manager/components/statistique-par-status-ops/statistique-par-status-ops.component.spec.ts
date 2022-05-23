import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiqueParStatusOpsComponent } from './statistique-par-status-ops.component';

describe('StatistiqueParStatusOpsComponent', () => {
  let component: StatistiqueParStatusOpsComponent;
  let fixture: ComponentFixture<StatistiqueParStatusOpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatistiqueParStatusOpsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatistiqueParStatusOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
