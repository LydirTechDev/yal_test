import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptiedTransfertSacComponent } from './emptied-transfert-sac.component';

describe('EmptiedTransfertSacComponent', () => {
  let component: EmptiedTransfertSacComponent;
  let fixture: ComponentFixture<EmptiedTransfertSacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptiedTransfertSacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptiedTransfertSacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
