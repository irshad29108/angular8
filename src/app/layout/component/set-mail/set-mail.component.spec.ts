import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetMailComponent } from './set-mail.component';

describe('SetMailComponent', () => {
  let component: SetMailComponent;
  let fixture: ComponentFixture<SetMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
