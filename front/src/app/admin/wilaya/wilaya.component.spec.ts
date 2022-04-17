import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WilayaComponent } from './wilaya.component';

describe('WilayaComponent', () => {
  let component: WilayaComponent;
  let fixture: ComponentFixture<WilayaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WilayaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WilayaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
