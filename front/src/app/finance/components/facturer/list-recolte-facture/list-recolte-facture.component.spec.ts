import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRecolteFactureComponent } from './list-recolte-facture.component';

describe('ListRecolteFactureComponent', () => {
  let component: ListRecolteFactureComponent;
  let fixture: ComponentFixture<ListRecolteFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRecolteFactureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRecolteFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
