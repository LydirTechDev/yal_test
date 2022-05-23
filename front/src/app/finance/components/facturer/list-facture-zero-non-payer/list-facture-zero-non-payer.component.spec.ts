import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFactureZeroNonPayerComponent } from './list-facture-zero-non-payer.component';

describe('ListFactureZeroNonPayerComponent', () => {
  let component: ListFactureZeroNonPayerComponent;
  let fixture: ComponentFixture<ListFactureZeroNonPayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFactureZeroNonPayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFactureZeroNonPayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
