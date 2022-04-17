import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingTarificationComponent } from './landing-tarification.component';

describe('LandingTarificationComponent', () => {
  let component: LandingTarificationComponent;
  let fixture: ComponentFixture<LandingTarificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingTarificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingTarificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
