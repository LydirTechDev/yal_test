import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWilayaSacRetourComponent } from './create-wilaya-sac-retour.component';

describe('CreateWilayaSacRetourComponent', () => {
  let component: CreateWilayaSacRetourComponent;
  let fixture: ComponentFixture<CreateWilayaSacRetourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWilayaSacRetourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWilayaSacRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
