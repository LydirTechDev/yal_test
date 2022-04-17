import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgenceSacRetourComponent } from './create-agence-sac-retour.component';

describe('CreateAgenceSacRetourComponent', () => {
  let component: CreateAgenceSacRetourComponent;
  let fixture: ComponentFixture<CreateAgenceSacRetourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAgenceSacRetourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAgenceSacRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
