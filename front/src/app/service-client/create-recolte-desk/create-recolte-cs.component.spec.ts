import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRecolteCsComponent } from './create-recolte-cs.component';

describe('CreateRecolteCsComponent', () => {
  let component: CreateRecolteCsComponent;
  let fixture: ComponentFixture<CreateRecolteCsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRecolteCsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRecolteCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
