import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ManagePublisherService } from 'src/app/servies/user/manage-publisher.service';
import * as moment from 'moment';
import { AbstractControl } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ManageBuyersService } from 'src/app/servies/user/manage-buyers.service';
import { RoleService } from 'src/app/servies/user/role.service';
import { ManageQueueService } from 'src/app/servies/user/manage-queue.service';
@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.css']
})
export class ManageAdminComponent implements OnInit {
  alwaysShowCalendars: boolean;
  public popoverTitle: string = 'Title';
  public popoverMessage: string = 'Are you really sure you want to do this?';
  public popoverClass: string = 'custompop';
  public confirmClicked: boolean = false;
  ManagePublisher: FormGroup;
  public cancelClicked: boolean = false;
  public date: FormControl = new FormControl();
  messageheadererror: any = '';
  messageheader: any = '';
  roledata:any=[]
  loader=true
  data:any;
  ManageBuyers: FormGroup;
  ranges: any = {

    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    //  'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],

  }

  currentDate: any = { start: moment(), end: moment() }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }


  constructor(private formBuilder: FormBuilder, private router: Router, private publisherservice: ManagePublisherService, public service: ManageBuyersService, public roleservice: RoleService,public queueservice:ManageQueueService) {
    this.alwaysShowCalendars = true;

  }

  ngOnInit() {
    this.data1();
    this.roleservice.getRole().subscribe((res: Response) => {
      let data = res['buyer'];
      for (var i of data) {
        if (i.name == 'admin' ) {
          let role = {
            name: i.name
          }
          this.roledata.push(role)
        }
      }
    })
    this.alltablepublisher();
  }
  alltablepublisher() {
    this.publisherservice.getManagePublisher().subscribe((res: Response) => {
      this.loader = false;
      this.data = res['user'];
      // for(var i of res['user']){

      // }

    })
  }
  add: boolean = false;
  clickadd() {
    // alert();
    this.ManagePublisher.reset();
    this.add = !this.add;
  }
  MustMatch(controlName: string, matchingControlName: string) {
    return (ManagePublisher: FormGroup) => {
      const control = ManagePublisher.controls[controlName];
      const matchingControl = ManagePublisher.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  data1() {
    this.ManagePublisher = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tfn: ['', Validators.required],
      contact: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      uid: ['']
    }, {
        validator: this.MustMatch('password', 'confirmPassword'),

      });
  }
  get f() { return this.ManagePublisher.controls; }
  submitted=false;
  loading=false;
  submitbutton=true;
  message='';
  publisher:any=[];
  statuscode:any;
  onSubmit() {
    this.submitted = true;
    if (this.ManagePublisher.invalid) {
      return;
    }
    this.loading = true;
    this.submitbutton = false;
    let uid = "";
    // this.ManagePublisher.controls.email.value.search("@")
    // this.publisherservice.emailVarification(this.ManagePublisher.controls.email.value).subscribe((res: Response) => {
    //   console.log(res);

    // console.log( this.Validateemail(res['user']));
    // if (res['user'] != '') {
    //   this.message = "Email already Exists";
    //   console.log(this.message);
    //   return;
    // } else {
    this.message = '';
    if (this.ManagePublisher.controls.uid.value != '' || this.ManagePublisher.controls.uid.value != undefined) {
      uid = this.ManagePublisher.controls.uid.value;
    }

    this.publisher = {
      'fullname': this.ManagePublisher.controls.name.value,
      'email': this.ManagePublisher.controls.email.value,
      'contact': this.ManagePublisher.controls.contact.value,
      'password': this.ManagePublisher.controls.password.value,
      'price_per_tfn': this.ManagePublisher.controls.tfn.value,
      'role': this.ManagePublisher.controls.role.value,
      'status': 'active',

    }
    //console.log(this.publisher);return;
    if (uid == '' || uid == null) {
      this.publisherservice.postManagePublisher(this.publisher).subscribe((res: Response) => {

        this.statuscode = res['status'];
        this.loading = false;
        this.submitbutton = true;
        if (this.statuscode == 'success') {
          this.messageheader = res['message'];
          setTimeout(() => {    //<<<---    using ()=> syntax
            this.messageheader = "";
          }, 5000);

          this.add = !this.add;
          this.alltablepublisher();
        } else {
          this.messageheader = "";
          this.messageheadererror = res['message'];
          setTimeout(() => {    //<<<---    using ()=> syntax
            this.messageheadererror = "";
          }, 5000);
        }

      })
    } else {
      this.publisherservice.updateManagePublisher(this.publisher, uid).subscribe((res: Response) => {


        this.statuscode = res['status'];
        this.loading = false;
        this.submitbutton = true;
        if (this.statuscode == 'success') {
          this.messageheader = res['message'];

          this.alltablepublisher();
          this.add = !this.add;
          setTimeout(() => {    //<<<---    using ()=> syntax
            this.messageheader = "";
          }, 5000);
        } else {
          this.messageheadererror = res['message'];
          this.messageheader = "";
          setTimeout(() => {    //<<<---    using ()=> syntax
            this.messageheadererror = "";
          }, 5000);
        }
      })
    }
    // }
    // })
  }

}
