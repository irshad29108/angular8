import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ManagePublisherService } from 'src/app/servies/user/manage-publisher.service';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { ManageBuyersService } from 'src/app/servies/user/manage-buyers.service';
import { RoleService } from 'src/app/servies/user/role.service';
import { ManageQueueService } from 'src/app/servies/user/manage-queue.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-manage-publisher',
  templateUrl: './manage-publisher.component.html',
  styleUrls: ['./manage-publisher.component.css']
})
export class ManagePublisherComponent implements OnInit {
  name: any;
  data: any = [];
  selected: any;
  filtervalue: any;
  messageheader: any = '';
  loader: boolean = true;
  loading: boolean = false;
  submitbutton: boolean = true;
  loading1: boolean = false;
  submitbutton1: boolean = true;

  alwaysShowCalendars: boolean;
  public popoverTitle: string = 'Title';
  public popoverMessage: string = 'Are you really sure you want to do this?';
  public popoverClass: string = 'custompop';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
  public date: FormControl = new FormControl();
  messageheadererror: any = '';
  ManageBuyers: FormGroup;
  ManagePublisher: FormGroup;
  ManageSetting: FormGroup;
  ManageQueue: FormGroup;
  submitted = false;
  submitted2 = false;
  submitted3 = false;
  publisher: {};
  public datapublisher: any = [];
  message: any;
  settinguid: number;
  settingdata: any = [];
  submit: { 'name': any; 'pub_id': any; 'address': any; 'email': any; 'contact': any; 'password': any; 'price_per_call': any; 'buffer_time': any; };
  dropdownpublisher: any = [];
  buyeruid: any;
  contact: string;
  email: string;
  role: string;
  statuscode: any
  roledata: any = [];
  showmethod=""
  alluser: any;
  ranges: any = {

    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    //  'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],

  }

  currentDate: any;
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  constructor(private toastr: ToastrService,private formBuilder: FormBuilder, private router: Router, private publisherservice: ManagePublisherService, public service: ManageBuyersService, public roleservice: RoleService, public queueservice: ManageQueueService) {
    this.alwaysShowCalendars = true;

  }

  ngOnInit() {
    this.alluser = JSON.parse(localStorage.getItem('username'));

    this.loader = true;
    //ManagePublisher formGroup
    this.data1();

    //Queue Formgroup
    this.Queue();

    //submitedd manageSitting
    this.manageSettingdata();

    //All Publisher show 
    this.alltablepublisher();

    //Buyer FormGroup
    this.allshowdata();
    

    //show Role dropdown
    this.roleservice.getRole().subscribe((res: Response) => {
      let data = res['buyer'];
      for (var i of data) {
        if (i.name != 'admin' && i.name != 'buyer') {
          let role = {
            name: i.name
          }
          this.roledata.push(role)
        }
      }
    })
  }


  // ========================== Publisher form details =====================================================

  //add edit Publisher show view
  add: boolean = false;
  button:any;
  publisherdesanding:any;
  clickadd() {
    // alert();
    this.button="Add"
    this.ManagePublisher.reset();
    this.add = !this.add;
  }
  //Error get function publisher 
  get f() { return this.ManagePublisher.controls; }
  alltablepublisher() {
    this.showmethod="loading"
    this.publisherservice.getManagePublisher().subscribe((res: Response) => {
      this.loader = false;
      this.publisherdesanding = res['user'];
      this.data=this.publisherdesanding.reverse();
      if(this.data==''){
        this.showmethod="no data";
      }else{
        this.showmethod="";
      }

    })
  }
  //Submit Publisher data field
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
     let publisherEmailCheck= this.data.find(data=>data.email==this.ManagePublisher.controls.email.value)
     if(publisherEmailCheck){
      this.loading = false;
      this.messageheadererror = "Email Already Exits";
      setTimeout(() => {    //<<<---    using ()=> syntax
        this.messageheadererror = "";
      }, 5000);
        return;
      }
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
      let publisherEmailCheck= this.data.find(data=>data.email==this.ManagePublisher.controls.email.value && this.ManagePublisher.controls.uid.value!=data.uid)
     if(publisherEmailCheck){
      this.loading = false;
      this.messageheadererror = "Email Already Exits";
      setTimeout(() => {    //<<<---    using ()=> syntax
        this.messageheadererror = "";
      }, 5000);
        return;
      }
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

  onReset() {
    this.submitted = false;
    this.ManagePublisher.reset();
  }

  //Edit Publisher Details
  edit(uid) {
    this.publisherservice.editManagePublisher(uid).subscribe((res: Response) => {
      this.datapublisher = res['user'];
      this.data1();
      this.button='Edit'
      this.add = !this.add;
    });



  }

  //Delete Publisher Details
  delete(uid) {
    this.publisherservice.deleteManagePublisher(uid).subscribe((res: Response) => {

      this.statuscode = res['status'];
      console.log(this.statuscode);
      if (this.statuscode == 'success') {
        this.alltablepublisher();
        this.messageheader = res['message'];
        setTimeout(() => {
          this.messageheader = "";
        }, 5000);
        this.cancelClicked = false;


      } else {
        this.messageheadererror = res['message'];
        setTimeout(() => {
          this.messageheadererror = "";
        }, 5000);

      }
    });


  }
  //Form Field Publisher
  data1() {
    this.ManagePublisher = this.formBuilder.group({
      name: [this.datapublisher.fullname, Validators.required],
      email: [this.datapublisher.email, [Validators.required, Validators.email]],
      tfn: [this.datapublisher.price_per_tfn, Validators.required],
      contact: [this.datapublisher.contact, Validators.required],
      role: [this.datapublisher.role, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      uid: [this.datapublisher.uid]
    }, {
        validator: this.MustMatch('password', 'confirmPassword'),

      });
  }
  //match password or confirm password
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
  // ========================== End of Publisher form details ===========================================

  // ========================== Queue form details ===========================================


  //show and hide Queue setting ui
  queueuid: any;
  queue: boolean = false;
  queue_monitor_value = 0;

  clickqueue(id) {

    if (id != undefined) {
        this.queueuid = id;
        if (id == 0) {
          this.ManageQueue.reset();
          this.queue = !this.queue;
        } else if (this.alluser.role != 'admin') {
          this.publisherservice.getManageSetting(id).subscribe((res: Response) => {
          this.settingdata = res['user'];
          this.statuscode = res['status'];
          if (this.statuscode == 'success') {
            this.queue_monitor_value = this.settingdata.queue_monitor;
            if(this.queue_monitor_value == 1){
              this.queue = !this.queue;
            }else{
              this.messageheadererror = 'Unauthorized access';
              setTimeout(() => {  
                this.messageheadererror = "";
              }, 5000);
            }
          }

        });
      }else{
        this.queue = !this.queue;
      }

    }

    console.log(this.settingdata);

  }
  //formgroup Queue 
  Queue() {
    this.ManageQueue = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      contact: ['', Validators.required],
      price_per_call: ['', Validators.required],
      buffer_time: ['', Validators.required],
      publisher: [''],
      confirmPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],


    }, {
        validator: this.MustMatch3('password', 'confirmPassword'),

      });
  }
  //get error of queue 
  get queuearray() { return this.ManageQueue.controls; }

  //match password or confirm password
  MustMatch3(controlName: string, matchingControlName: string) {
    return (ManageQueue: FormGroup) => {
      const control = ManageQueue.controls[controlName];
      const matchingControl = ManageQueue.controls[matchingControlName];

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

  //submit queue details
  onSubmit4() {
    this.submitted3 = true;
    if (this.ManageQueue.invalid) {
      return;
    }
    this.loading1 = true;
    this.submitbutton1 = false;
    this.submit = {
      'name': this.ManageQueue.controls.name.value,
      'pub_id': this.queueuid,
      'address': this.ManageQueue.controls.address.value,
      'email': this.ManageQueue.controls.email.value,
      'contact': this.ManageQueue.controls.contact.value,
      'password': this.ManageQueue.controls.password.value,
      'price_per_call': this.ManageQueue.controls.price_per_call.value,
      'buffer_time': this.ManageQueue.controls.buffer_time.value,
    }
    this.queueservice.postQueue(this.submit).subscribe((res: Response) => {
      this.loading1 = false;
      this.submitbutton1 = true;
      this.statuscode = res['status'];
      if (this.statuscode == 'success') {

        this.messageheader = res['message'];
        setTimeout(() => {    //<<<---    using ()=> syntax
          this.messageheader = "";

        }, 5000);
      } else {
        this.messageheadererror = res['message'];
        setTimeout(() => {    //<<<---    using ()=> syntax
          this.messageheadererror = "";
        }, 5000);
      }
      this.queue = !this.queue;
    })
  }

  // ========================== End of Queue form details ===========================================

  // ========================== Buyer form details ===========================================

  //show and hide Buyer setting ui
  addbuyer: boolean = false;
  clickbuyer(id) {
    if (id != undefined) {
      if (id != 0) {
        this.buyeruid = id;
      } else {
        this.ManageBuyers.reset();
      }
    }
    this.addbuyer = !this.addbuyer;
  }

  //formgroup of Buyers
  allshowdata() {
    this.ManageBuyers = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      contact: ['', Validators.required],
      price_per_call: ['', Validators.required],
      buffer_time: ['', Validators.required],
      publisher: [''],
      confirmPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],


    }, {
        validator: this.MustMatch2('password', 'confirmPassword'),

      });
  }

  //get Error of buyer
  get buyer() { return this.ManageBuyers.controls; }

  //match password or confirm password
  MustMatch2(controlName: string, matchingControlName: string) {
    return (ManageBuyers: FormGroup) => {
      const control = ManageBuyers.controls[controlName];
      const matchingControl = ManageBuyers.controls[matchingControlName];

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

  //SUBMIT buyer details 
  onSubmit3() {
    this.submitted2 = true;
    if (this.ManageBuyers.invalid) {
      return;
    }
    this.loading1 = true;
    this.submitbutton1 = false;
    this.submit = {
      'name': this.ManageBuyers.controls.name.value,
      'pub_id': this.buyeruid,
      'address': this.ManageBuyers.controls.address.value,
      'email': this.ManageBuyers.controls.email.value,
      'contact': this.ManageBuyers.controls.contact.value,
      'password': this.ManageBuyers.controls.password.value,
      'price_per_call': this.ManageBuyers.controls.price_per_call.value,
      'buffer_time': this.ManageBuyers.controls.buffer_time.value,
    }


    this.service.postBuyersPublisher(this.submit).subscribe((res: Response) => {
 
      this.loading1 = false;
      this.submitbutton1 = true;
      this.statuscode = res['status'];
      if (this.statuscode == 'success') {

        this.messageheader = res['message'];
        setTimeout(() => {    //<<<---    using ()=> syntax
          this.messageheader = "";

        }, 5000);
      } else {
        this.messageheadererror = res['message'];;
        setTimeout(() => {    //<<<---    using ()=> syntax
          this.messageheadererror = "";
        }, 5000);
      }
      this.addbuyer = !this.addbuyer;

    });
  }
  // ========================== End of Buyer form details ===========================================

  // ==========================filter details =========================================== 

  selectedFilter: string = '';

  filtr1: boolean = false;
  filtr2: boolean = false;
  filtr3: boolean = false;
  filtr4: boolean = false;
  status: boolean = false;
  //filter panel to search
  clickFilter() {
    // alert();
    this.status = !this.status;
  }

  selectChangeFilter(event: any) {
    //update the ui
    let optlent = event.target.options.length;
    let text = event.target.options.selectedIndex;
    this.selectedFilter = event.target.value;

    for (let i = 1; i < optlent; i++) {
      // console.log(this.fliterList[i-1]);
      let statIndx = "filtr" + i;

      if (i == text) {

        this[statIndx] = true;
      } else {

        // this[statIndx] = false;
      }
    }


  }
  closefiltr(num) {
    // this[num] = false;
    if (num == 'filtr1') {
      this.name = "";
    }
    if (num == 'filtr2') {
      this.contact = "";
    }
    if (num == 'filtr3') {
      this.email = "";
    }
    if (num == 'filtr4') {
      this.role = "";
    }

  }
  resetfilter(){
    this.name = "";
    this.contact = "";
    this.email = "";
    this.role = "";
  }
  // ==========================filter details =========================================== 

  // ========================== Publisher Setting details =========================================== 

  //submit setting details
  onSubmit2() {
    // alert(this.settinguid);
    //console.log(this.settinguid);
    let recording = 0;
    let queue_monitor = 0;
    let cnum = 0
    let wallet = 0;
    let phone_system = 0;
    let inside_routing = 0;
    let outside_routing = 0;
    if (this.ManageSetting.controls.recording.value == true) {
      recording = 1;
    }
    if (this.ManageSetting.controls.cnum.value == true) {
      cnum = 1;
    }
    if (this.ManageSetting.controls.wallet.value == true) {
      wallet = 1;
    }
    if (this.ManageSetting.controls.inside_routing.value == true) {
      inside_routing = 1;
    }
    if (this.ManageSetting.controls.outside_routing.value == true) {
      outside_routing = 1;
    }
    if (this.ManageSetting.controls.phone_system.value == true) {
      phone_system = 1;
    }
    if (this.ManageSetting.controls.queue_monitor.value == true) {
      queue_monitor = 1;
    }

    let settingsubmited = {
      'enabled_record': Number(recording),
      'queue_monitor': Number(queue_monitor),
      'display_cnum': Number(cnum),
      'display_wallet': Number(wallet),
      'phone_system': Number(phone_system),
      'enable_inside_route': Number(inside_routing),
      'enable_outside_route': Number(outside_routing),
      'daily_tfns': this.ManageSetting.controls.daily_tfn.value,
      'monthly_tfns': this.ManageSetting.controls.monthly_tfn.value,
      'buyers_limit': this.ManageSetting.controls.buyers_limit.value,
      'call_reducer': this.ManageSetting.controls.call_reducer.value,
      'usage_module': this.ManageSetting.controls.usage_module.value,
      'filtered': this.ManageSetting.controls.filtered.value,
      'number_to_ivr': this.ManageSetting.controls.number_to_ivr.value,
      'show_buyer_no': this.ManageSetting.controls.show_buyer_no.value,
      'hide_campaign': this.ManageSetting.controls.hide_campaign.value,
      'charge_per_minute': this.ManageSetting.controls.charge_per_minute.value,
      'buyer_capping': this.ManageSetting.controls.buyer_capping.value,
      'buyernumber_cdr': this.ManageSetting.controls.buyernumber_cdr.value,

    }
    this.publisherservice.putManageSetting(this.settinguid, settingsubmited).subscribe((res: Response) => {
      this.statuscode = res['status'];
      if (this.statuscode == 'success') {
        this.messageheader = res['message'];
        this.setting = !this.setting;
        setTimeout(() => {    //<<<---    using ()=> syntax
          this.messageheader = "";

        }, 5000);
      } else {
        this.messageheadererror = res['message'];;
        setTimeout(() => {    //<<<---    using ()=> syntax
          this.messageheadererror = "";
        }, 5000);
      }
    });

  }

  //setting formGroup
  manageSettingdata() {
    let recording = false;
    let queue_monitor = false;
    let cnum = false
    let wallet = false;
    let phone_system = false;
    let inside_routing = false;
    let outside_routing = false;
    if (this.settingdata.enabled_record == 1) {
      recording = true;
    }
    if (this.settingdata.display_cnum == 1) {
      cnum = true;
    }
    if (this.settingdata.display_wallet == 1) {
      wallet = true;
    }
    if (this.settingdata.phone_system == 1) {
      phone_system = true;
    }
    if (this.settingdata.enable_inside_route == 1) {
      inside_routing = true;
    }
    if (this.settingdata.enable_outside_route == 1) {
      outside_routing = true;
    }

    if (this.settingdata.queue_monitor == 1) {
      queue_monitor = true;
    }

    
    this.ManageSetting = this.formBuilder.group({
      recording: [recording],
      queue_monitor: [queue_monitor],
      cnum: [cnum],
      wallet: [wallet],
      phone_system: [phone_system],
      inside_routing: [inside_routing],
      outside_routing: [outside_routing],
      daily_tfn: [this.settingdata.daily_tfns],
      monthly_tfn: [this.settingdata.monthly_tfns],
      buyers_limit: [this.settingdata.buyers_limit],
      call_reducer: [this.settingdata.call_reducer],
      usage_module: 1,
      filtered: 1,
      number_to_ivr: 1,
      show_buyer_no: 1,
      hide_campaign: 1,
      charge_per_minute: 1,
      buyer_capping: 1,
      buyernumber_cdr: 1

    });
  }
  setting: boolean = false;

  //show and hide publisher setting ui
  clicksetting(uid) {
    if (uid != undefined) {
      this.settinguid = uid;
      this.publisherservice.getManageSetting(uid).subscribe((res: Response) => {
        this.settingdata = res['user'];
        this.statuscode = res['status'];
        if (this.statuscode == 'success') {
          this.manageSettingdata();
        }

      });
    }
    this.setting = !this.setting;

  }

  // ========================== End of Publisher Setting =========================================== 

  daterange() {

    this.data = this.data.filter(
      m => new Date(m.created_at) >= new Date(this.currentDate.startDate._d) && new Date(m.created_at) <= new Date(this.currentDate.endDate._d)
    );
  }
  statuschange(id,status){
    let changestatus={
      'status':status
    }
    this.toastr.success('Status', status +' SucessFully');
    console.log(changestatus);
    this.publisherservice.postPublisherStatus(id,changestatus).subscribe((res:Response)=>{
      console.log(res);
      
    })
  }
  resetcal(){
    this.currentDate='';
  }
}
