import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRecolteComponent } from './create-recolte.component';

describe('CreateRecolteComponent', () => {
  let component: CreateRecolteComponent;
  let fixture: ComponentFixture<CreateRecolteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRecolteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRecolteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
