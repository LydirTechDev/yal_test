import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibererPaimentsComponent } from './liberer-paiments.component';

describe('LibererPaimentsComponent', () => {
  let component: LibererPaimentsComponent;
  let fixture: ComponentFixture<LibererPaimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibererPaimentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibererPaimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
