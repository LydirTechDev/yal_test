import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFactureZeroPayerComponent } from './list-facture-zero-payer.component';

describe('ListFactureZeroPayerComponent', () => {
  let component: ListFactureZeroPayerComponent;
  let fixture: ComponentFixture<ListFactureZeroPayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFactureZeroPayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFactureZeroPayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
