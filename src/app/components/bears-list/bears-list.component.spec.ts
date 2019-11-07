import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BearsListComponent } from './bears-list.component';

describe('BearsListComponent', () => {
  let component: BearsListComponent;
  let fixture: ComponentFixture<BearsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BearsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BearsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
