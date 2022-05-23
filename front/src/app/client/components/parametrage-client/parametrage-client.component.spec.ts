import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrageClientComponent } from './parametrage-client.component';

describe('ParametrageClientComponent', () => {
  let component: ParametrageClientComponent;
  let fixture: ComponentFixture<ParametrageClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametrageClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrageClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
