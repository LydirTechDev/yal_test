import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPaiementsClientComponent } from './info-paiements-client.component';

describe('InfoPaiementsClientComponent', () => {
  let component: InfoPaiementsClientComponent;
  let fixture: ComponentFixture<InfoPaiementsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPaiementsClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPaiementsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
