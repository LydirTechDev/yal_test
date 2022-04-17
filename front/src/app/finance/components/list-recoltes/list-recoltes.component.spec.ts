import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRecoltesComponent } from './list-recoltes.component';

describe('ListRecoltesComponent', () => {
  let component: ListRecoltesComponent;
  let fixture: ComponentFixture<ListRecoltesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRecoltesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRecoltesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
