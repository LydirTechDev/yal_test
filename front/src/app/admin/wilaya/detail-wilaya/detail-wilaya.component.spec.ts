import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailWilayaComponent } from './detail-wilaya.component';

describe('DetailWilayaComponent', () => {
  let component: DetailWilayaComponent;
  let fixture: ComponentFixture<DetailWilayaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailWilayaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailWilayaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
