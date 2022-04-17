import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransfertSacComponent } from './create-transfert-sac.component';

describe('CreateTransfertSacComponent', () => {
  let component: CreateTransfertSacComponent;
  let fixture: ComponentFixture<CreateTransfertSacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTransfertSacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTransfertSacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
