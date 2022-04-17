import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSE500Component } from './internal-se500.component';

describe('InternalSE500Component', () => {
  let component: InternalSE500Component;
  let fixture: ComponentFixture<InternalSE500Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalSE500Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSE500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
