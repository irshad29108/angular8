import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAuditProfileComponent } from './manage-audit-profile.component';

describe('ManageAuditProfileComponent', () => {
  let component: ManageAuditProfileComponent;
  let fixture: ComponentFixture<ManageAuditProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAuditProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAuditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
