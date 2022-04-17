import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagesPoidsComponent } from './plages-poids.component';

describe('PlagesPoidsComponent', () => {
  let component: PlagesPoidsComponent;
  let fixture: ComponentFixture<PlagesPoidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlagesPoidsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlagesPoidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
