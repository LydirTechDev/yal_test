import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptiedAgenceSacComponent } from './emptied-agence-sac.component';

describe('EmptiedAgenceSacComponent', () => {
  let component: EmptiedAgenceSacComponent;
  let fixture: ComponentFixture<EmptiedAgenceSacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptiedAgenceSacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptiedAgenceSacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
