import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { RoleService } from 'src/app/servies/user/role.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  
    public data : any
    public popoverClass: string = 'custompop'; 
    public popoverTitle: string = 'Title';
    public popoverMessage: string = 'Are you really sure you want to do this?';
    statuscode:any;
    messageheader:any;
    messageheadererror:any;
    loading:boolean=false;
    submitbutton=true
    Role:FormGroup;
    selected: any;
    submitted:boolean=false;
    alwaysShowCalendars: boolean;
    ranges: any = {
      
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
    currentDate: any = {start: moment(), end: moment()}
    invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
    
    isInvalidDate = (m: moment.Moment) =>  {
      return this.invalidDates.some(d => d.isSame(m, 'day') )
    } 
    
    constructor(public service:RoleService,private formBuilder: FormBuilder,) {
      this.alwaysShowCalendars = true;
    }

  ngOnInit() {
    this.roleForm();
    this.allrole();
  }
  allrole(){
    this.service.getRole().subscribe((res:Response)=>{
      console.log(res);
      this.data=res['buyer'];
    })
  }

  status: boolean = false;
  clickFilter(){
    // alert();
      this.status = !this.status;       
  }
  add: boolean = false;
  clickadd() {
    // alert();
    this.add = !this.add;
  }
  roleForm(){
    this.Role=this.formBuilder.group({
      'name':['',Validators.required],
      'status':['',Validators.required],
    })
  }
  get f(){
    return this.Role.controls;
  }
  onSubmit(){
    this.submitted=true;
    if(this.Role.invalid){
      return ;
    }
    this.loading=true;
    this.submitbutton=false;
    let role={
      'name':this.Role.controls.name.value,
      'status':this.Role.controls.status.value,
    }
    this.service.postAddRole(role).subscribe((res:Response)=>{
      console.log(res);
      this.loading=false;
      this.submitbutton=true;
      this.statuscode=res['status'];
            
            if (this.statuscode == 'success') {
              this.allrole();
              this.add = !this.add;
             this.messageheader=res['message'];
             setTimeout(()=>{    //<<<---    using ()=> syntax
              this.messageheader = "";
             }, 5000);
        
            
              
            } else {
              this.messageheader="";
              this.messageheadererror="Error";
              setTimeout(()=>{    //<<<---    using ()=> syntax
                this.messageheadererror = "";
               }, 5000);
            }
    })
  }
  delete(id){
    this.service.deleteRole(id).subscribe((res:Response)=>{
      this.statuscode=res['status'];
            
            if (this.statuscode == 'success') {
              this.allrole();
             this.messageheader=res['message'];
             setTimeout(()=>{    //<<<---    using ()=> syntax
              this.messageheader = "";
             }, 5000);
        
            
              
            } else {
              this.messageheader="";
              this.messageheadererror=res['message'];
              setTimeout(()=>{    //<<<---    using ()=> syntax
                this.messageheadererror = "";
               }, 5000);
            }
    })
  }
}
