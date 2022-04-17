import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgenceSacComponent } from './create-agence-sac.component';

describe('CreateAgenceSacComponent', () => {
  let component: CreateAgenceSacComponent;
  let fixture: ComponentFixture<CreateAgenceSacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAgenceSacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAgenceSacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
