import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRecolteRegularisationComponent } from './list-recolte-regularisation.component';

describe('ListRecolteRegularisationComponent', () => {
  let component: ListRecolteRegularisationComponent;
  let fixture: ComponentFixture<ListRecolteRegularisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRecolteRegularisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRecolteRegularisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
