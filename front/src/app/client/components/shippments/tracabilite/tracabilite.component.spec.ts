import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracabiliteComponent } from './tracabilite.component';

describe('TracabiliteComponent', () => {
  let component: TracabiliteComponent;
  let fixture: ComponentFixture<TracabiliteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TracabiliteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TracabiliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
