import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptiedWilayaSacComponent } from './emptied-wilaya-sac.component';

describe('EmptiedWilayaSacComponent', () => {
  let component: EmptiedWilayaSacComponent;
  let fixture: ComponentFixture<EmptiedWilayaSacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptiedWilayaSacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptiedWilayaSacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
