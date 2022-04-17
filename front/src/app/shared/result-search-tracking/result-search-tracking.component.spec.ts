import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSearchTrackingComponent } from './result-search-tracking.component';

describe('ResultSearchTrackingComponent', () => {
  let component: ResultSearchTrackingComponent;
  let fixture: ComponentFixture<ResultSearchTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultSearchTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSearchTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
