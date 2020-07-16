import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagecampaignComponent } from './managecampaign.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

describe('ManagecampaignComponent', () => {
  let component: ManagecampaignComponent;
  let fixture: ComponentFixture<ManagecampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagecampaignComponent ],
      imports:[
        FormsModule,
        RouterTestingModule,
        NgxDaterangepickerMd,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagecampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
