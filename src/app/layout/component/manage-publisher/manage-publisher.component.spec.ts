import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePublisherComponent } from './manage-publisher.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DataTableModule } from "angular-6-datatable";
import {Pipe, PipeTransform} from '@angular/core';
import { PublisherFilterPipe } from './publisher-filter.pipe';

fdescribe('ManagePublisherComponent', () => {
  let component: ManagePublisherComponent;
  let fixture: ComponentFixture<ManagePublisherComponent>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePublisherComponent,PublisherFilterPipe ],
      imports:[
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        NgxDaterangepickerMd,
        DataTableModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
