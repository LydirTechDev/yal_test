import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCoursierComponent } from './detail-coursier.component';

describe('DetailCoursierComponent', () => {
  let component: DetailCoursierComponent;
  let fixture: ComponentFixture<DetailCoursierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCoursierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCoursierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
