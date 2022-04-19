import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturerComponent } from './facturer.component';

describe('FacturerComponent', () => {
  let component: FacturerComponent;
  let fixture: ComponentFixture<FacturerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
