import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdrReportsComponent } from './cdr-reports.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('CdrReportsComponent', () => {
  let component: CdrReportsComponent;
  let fixture: ComponentFixture<CdrReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdrReportsComponent ],
      imports:[
        FormsModule,
        RouterTestingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdrReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
