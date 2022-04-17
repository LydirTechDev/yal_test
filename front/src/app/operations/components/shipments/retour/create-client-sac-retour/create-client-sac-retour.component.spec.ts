import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientSacRetourComponent } from './create-client-sac-retour.component';

describe('CreateClientSacRetourComponent', () => {
  let component: CreateClientSacRetourComponent;
  let fixture: ComponentFixture<CreateClientSacRetourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateClientSacRetourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClientSacRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
