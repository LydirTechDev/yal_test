import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransfertSacRetourComponent } from './create-transfert-sac-retour.component';

describe('CreateTransfertSacRetourComponent', () => {
  let component: CreateTransfertSacRetourComponent;
  let fixture: ComponentFixture<CreateTransfertSacRetourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTransfertSacRetourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTransfertSacRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
