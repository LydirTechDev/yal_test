import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecolteRegularisationComponent } from './recolte-regularisation.component';

describe('RecolteRegularisationComponent', () => {
  let component: RecolteRegularisationComponent;
  let fixture: ComponentFixture<RecolteRegularisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecolteRegularisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecolteRegularisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
