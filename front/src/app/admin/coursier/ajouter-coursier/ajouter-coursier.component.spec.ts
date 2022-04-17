import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterCoursierComponent } from './ajouter-coursier.component';

describe('AjouterCoursierComponent', () => {
  let component: AjouterCoursierComponent;
  let fixture: ComponentFixture<AjouterCoursierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterCoursierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterCoursierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
