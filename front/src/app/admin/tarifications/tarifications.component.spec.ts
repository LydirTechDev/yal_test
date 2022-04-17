import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarificationsComponent } from './tarifications.component';

describe('TarificationsComponent', () => {
  let component: TarificationsComponent;
  let fixture: ComponentFixture<TarificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
