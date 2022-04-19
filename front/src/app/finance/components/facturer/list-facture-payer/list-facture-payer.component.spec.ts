import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFacturePayerComponent } from './list-facture-payer.component';

describe('ListFacturePayerComponent', () => {
  let component: ListFacturePayerComponent;
  let fixture: ComponentFixture<ListFacturePayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFacturePayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFacturePayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
