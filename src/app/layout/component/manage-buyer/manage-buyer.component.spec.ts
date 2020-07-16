import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBuyerComponent } from './manage-buyer.component';

describe('ManageBuyerComponent', () => {
  let component: ManageBuyerComponent;
  let fixture: ComponentFixture<ManageBuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageBuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
