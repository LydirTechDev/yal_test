import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFactureNonPayerComponent } from './list-facture-non-payer.component';

describe('ListFactureNonPayerComponent', () => {
  let component: ListFactureNonPayerComponent;
  let fixture: ComponentFixture<ListFactureNonPayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFactureNonPayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFactureNonPayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
