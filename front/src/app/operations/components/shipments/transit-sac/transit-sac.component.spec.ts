import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitSacComponent } from './transit-sac.component';

describe('TransitSacComponent', () => {
  let component: TransitSacComponent;
  let fixture: ComponentFixture<TransitSacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransitSacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitSacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
