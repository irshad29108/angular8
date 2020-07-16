import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssignTfnComponent } from './add-assign-tfn.component';

describe('AddAssignTfnComponent', () => {
  let component: AddAssignTfnComponent;
  let fixture: ComponentFixture<AddAssignTfnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssignTfnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssignTfnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
