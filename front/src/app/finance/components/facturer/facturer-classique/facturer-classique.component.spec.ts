import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturerClassiqueComponent } from './facturer-classique.component';

describe('FacturerClassiqueComponent', () => {
  let component: FacturerClassiqueComponent;
  let fixture: ComponentFixture<FacturerClassiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturerClassiqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturerClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
