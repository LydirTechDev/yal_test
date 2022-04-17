import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCodeTarifComponent } from './create-code-tarif.component';

describe('CreateCodeTarifComponent', () => {
  let component: CreateCodeTarifComponent;
  let fixture: ComponentFixture<CreateCodeTarifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCodeTarifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCodeTarifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
