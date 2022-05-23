import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoRecolteComponent } from './info-recolte.component';

describe('InfoRecolteComponent', () => {
  let component: InfoRecolteComponent;
  let fixture: ComponentFixture<InfoRecolteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoRecolteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoRecolteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
