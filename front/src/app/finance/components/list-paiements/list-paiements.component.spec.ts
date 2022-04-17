import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaiementsComponent } from './list-paiements.component';

describe('ListPaiementsComponent', () => {
  let component: ListPaiementsComponent;
  let fixture: ComponentFixture<ListPaiementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPaiementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPaiementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
