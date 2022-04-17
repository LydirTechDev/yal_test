import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailShippmentComponent } from './detail-shippment.component';

describe('DetailShippmentComponent', () => {
  let component: DetailShippmentComponent;
  let fixture: ComponentFixture<DetailShippmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailShippmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailShippmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
