import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadShippmnetsComponent } from './upload-shippmnets.component';

describe('UploadShippmnetsComponent', () => {
  let component: UploadShippmnetsComponent;
  let fixture: ComponentFixture<UploadShippmnetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadShippmnetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadShippmnetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
