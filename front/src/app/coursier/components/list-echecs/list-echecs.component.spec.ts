import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEchecsComponent } from './list-echecs.component';

describe('ListEchecsComponent', () => {
  let component: ListEchecsComponent;
  let fixture: ComponentFixture<ListEchecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEchecsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEchecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
