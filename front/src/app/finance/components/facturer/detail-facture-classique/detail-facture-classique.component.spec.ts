import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailFactureClassiqueComponent } from './detail-facture-classique.component';



describe('DetailFactureComponent', () => {
  let component: DetailFactureClassiqueComponent;
  let fixture: ComponentFixture<DetailFactureClassiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailFactureClassiqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFactureClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
