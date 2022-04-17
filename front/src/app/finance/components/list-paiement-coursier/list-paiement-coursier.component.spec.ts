import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaiementCoursierComponent } from './list-paiement-coursier.component';

describe('ListPaiementCoursierComponent', () => {
  let component: ListPaiementCoursierComponent;
  let fixture: ComponentFixture<ListPaiementCoursierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPaiementCoursierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPaiementCoursierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
