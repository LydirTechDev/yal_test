import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemetreColisClientComponent } from './remetre-colis-client.component';

describe('RemetreColisClientComponent', () => {
  let component: RemetreColisClientComponent;
  let fixture: ComponentFixture<RemetreColisClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemetreColisClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemetreColisClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
