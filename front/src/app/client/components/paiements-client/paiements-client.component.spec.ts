import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementsClientComponent } from './paiements-client.component';

describe('PaiementsClientComponent', () => {
  let component: PaiementsClientComponent;
  let fixture: ComponentFixture<PaiementsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaiementsClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaiementsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
