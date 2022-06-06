import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecolteFactureComponent } from './recolte-facture.component';

describe('RecolteFactureComponent', () => {
  let component: RecolteFactureComponent;
  let fixture: ComponentFixture<RecolteFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecolteFactureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecolteFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
