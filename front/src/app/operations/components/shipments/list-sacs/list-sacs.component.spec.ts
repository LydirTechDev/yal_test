import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSacsComponent } from './list-sacs.component';

describe('ListSacsComponent', () => {
  let component: ListSacsComponent;
  let fixture: ComponentFixture<ListSacsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSacsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSacsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
