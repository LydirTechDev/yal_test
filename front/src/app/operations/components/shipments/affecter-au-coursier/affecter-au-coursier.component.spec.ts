import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffecterAuCoursierComponent } from './affecter-au-coursier.component';

describe('AffecterAuCoursierComponent', () => {
  let component: AffecterAuCoursierComponent;
  let fixture: ComponentFixture<AffecterAuCoursierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffecterAuCoursierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffecterAuCoursierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
