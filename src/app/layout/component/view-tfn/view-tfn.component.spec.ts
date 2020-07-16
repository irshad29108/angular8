import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTfnComponent } from './view-tfn.component';

describe('ViewTfnComponent', () => {
  let component: ViewTfnComponent;
  let fixture: ComponentFixture<ViewTfnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTfnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTfnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
