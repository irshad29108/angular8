import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IvrService } from 'src/app/servies/ivr/ivr-service';
import { Item } from 'angular2-multiselect-dropdown';
import { Select2OptionData } from 'ng-select2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ivr',
  templateUrl: './ivrentry.component.html',
  styleUrls: ['./ivrentry.component.css']
})
export class IvrentryComponent implements OnInit {
  public popoverTitle: string = 'Title';
  public popoverMessage: string = 'Are you really sure you want to do this?';
  public popoverClass: string = 'custompop';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
  public filetePanel:boolean=false;
  
  addIVR:boolean=false;
  FormgroupClass:FormGroup;
  button:any="Add"
  submitted=false;
  loading=false;
  editData:any
  data:any=[]
  public MusicData: Array<Select2OptionData>;
  name: string;
  description: string;
  announcement: string;
  tab: any = 'tab1';

  constructor(public fb:FormBuilder,public ivrService:IvrService,public toaster:ToastrService, public routepart:Router) { }

  ngOnInit() {
    this.allIVRData();
  }  

  allIVRData(){
    this.ivrService.getAllIvr().subscribe((ivr:any)=>{
      if(ivr['statusCode']==200){
        this.data=ivr['data'];
      }
    })
  }
delete(id){
    this.ivrService.deleteIvr(id).subscribe((res:any)=>{
      if (res['statusCode'] == '200') {
        this.ivrService.deleteIvrEntries(id).subscribe((res:any)=>{
          this.toaster.success('Succes', 'IVR  deleted succesfully')
          this.allIVRData();
        });
      } else {
        this.toaster.error('Error', 'Something went wrog')
      }
    })
  }
clickFilter(){
    this.filetePanel =!this.filetePanel;
}
resetfilter(){
  this.name = '';
}

closefiltr(num) {
  if (num == 'filtr1') {
    this.name = '';
  }
  this.allIVRData();
}

editIvr(id){
  if(id){
    this.routepart.navigateByUrl('/dashboard/ivr?ivr_id='+id);
  }else{
    this.routepart.navigate(['/dashboard/ivr']);
  }
 
}


}

