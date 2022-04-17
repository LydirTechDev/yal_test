import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeTarifDetailComponent } from './code-tarif-detail.component';

describe('CodeTarifDetailComponent', () => {
  let component: CodeTarifDetailComponent;
  let fixture: ComponentFixture<CodeTarifDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeTarifDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeTarifDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
