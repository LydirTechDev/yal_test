import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRotationComponent } from './detail-rotation.component';

describe('DetailRotationComponent', () => {
  let component: DetailRotationComponent;
  let fixture: ComponentFixture<DetailRotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailRotationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
