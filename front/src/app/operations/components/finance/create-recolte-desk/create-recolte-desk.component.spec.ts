import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRecolteDeskComponent } from './create-recolte-desk.component';

describe('CreateRecolteDeskComponent', () => {
  let component: CreateRecolteDeskComponent;
  let fixture: ComponentFixture<CreateRecolteDeskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRecolteDeskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRecolteDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
