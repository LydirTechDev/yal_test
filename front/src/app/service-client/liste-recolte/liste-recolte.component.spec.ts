import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeRecolteComponent } from './liste-recolte.component';

describe('ListeRecolteComponent', () => {
  let component: ListeRecolteComponent;
  let fixture: ComponentFixture<ListeRecolteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeRecolteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeRecolteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
