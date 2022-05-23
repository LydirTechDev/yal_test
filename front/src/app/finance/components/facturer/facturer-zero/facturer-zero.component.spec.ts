import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturerZeroComponent } from './facturer-zero.component';

describe('FacturerZeroComponent', () => {
  let component: FacturerZeroComponent;
  let fixture: ComponentFixture<FacturerZeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturerZeroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturerZeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
