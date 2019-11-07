import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCarouselComponent } from './modal-carousel.component';

describe('ModalCarouselComponent', () => {
  let component: ModalCarouselComponent;
  let fixture: ComponentFixture<ModalCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
