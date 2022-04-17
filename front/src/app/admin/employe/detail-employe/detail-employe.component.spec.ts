import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEmployeComponent } from './detail-employe.component';

describe('DetailEmployeComponent', () => {
  let component: DetailEmployeComponent;
  let fixture: ComponentFixture<DetailEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailEmployeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
