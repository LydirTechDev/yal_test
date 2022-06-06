import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularisationComponent } from './regularisation.component';

describe('RegularisationComponent', () => {
  let component: RegularisationComponent;
  let fixture: ComponentFixture<RegularisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegularisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
