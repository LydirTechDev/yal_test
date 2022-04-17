import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWilayaSacComponent } from './create-wilaya-sac.component';

describe('CreateWilayaSacComponent', () => {
  let component: CreateWilayaSacComponent;
  let fixture: ComponentFixture<CreateWilayaSacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWilayaSacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWilayaSacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
