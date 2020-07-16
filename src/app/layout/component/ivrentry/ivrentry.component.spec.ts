import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IvrentryComponent } from './ivrentry.component';

describe('IvrentryComponent', () => {
  let component: IvrentryComponent;
  let fixture: ComponentFixture<IvrentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IvrentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IvrentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
