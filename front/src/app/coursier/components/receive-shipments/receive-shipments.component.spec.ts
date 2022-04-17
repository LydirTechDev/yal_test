import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveShipmentsComponent } from './receive-shipments.component';

describe('ReceiveShipmentsComponent', () => {
  let component: ReceiveShipmentsComponent;
  let fixture: ComponentFixture<ReceiveShipmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveShipmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveShipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
