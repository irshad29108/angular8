import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherBalanceComponent } from './publisher-balance.component';

describe('PublisherBalanceComponent', () => {
  let component: PublisherBalanceComponent;
  let fixture: ComponentFixture<PublisherBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublisherBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
