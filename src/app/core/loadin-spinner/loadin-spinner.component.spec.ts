import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadinSpinnerComponent } from './loadin-spinner.component';

describe('LoadinSpinnerComponent', () => {
  let component: LoadinSpinnerComponent;
  let fixture: ComponentFixture<LoadinSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadinSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadinSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
