import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ManageQueueService } from 'src/app/servies/user/manage-queue.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManagePublisherService } from 'src/app/servies/user/manage-publisher.service';
@Component({
  selector: 'app-manage-queue',
  templateUrl: './manage-queue.component.html',
  styleUrls: ['./manage-queue.component.css']
})
export class ManageQueueComponent implements OnInit {

  data: any = [];
  editdata: any = [];
  selected: any;
  ManageQueue: FormGroup;
  ManageQueueNumber: FormGroup;
  alwaysShowCalendars: boolean;
  messageheader: any = '';
  messageheadererror: any = '';
  statuscode: any
  loading1: boolean = false;
  submitbutton1: boolean = true;
  submitted3 = false;
  publisher: any;
  submitted1 = false;
  ispublisher=false;
  public popoverTitle: string = 'Title';
  public popoverMessage: string = 'Are you really sure you want to do this?';
  public popoverClass: string = 'custompop';
  dropdownpublisher: any = []
  publisher_setting:any;
  publisher_setting_que_monitor:boolean = false;
  ranges: any = {

    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    //  'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],

  }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  queueid: any;
  alluser: any;

  constructor(public services: ManageQueueService, private formBuilder: FormBuilder, public publiserserive: ManagePublisherService) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {

      this.alluser = JSON.parse(localStorage.getItem('username'));

      if(this.alluser.role !='admin'){
        var statuscode;
        this.publiserserive.getManageSetting(this.alluser.uid).subscribe((res: Response) => {
          //console.log(res)
             statuscode =  res['status'];
          if (statuscode == 'success') {
            this.publisher_setting = res['user'];
            this.publisher_setting_que_monitor=this.publisher_setting.queue_monitor==0?false:true
          }
        });
      }else{
        this.publisher_setting_que_monitor= true;
      }


      //FormGroup of Queue 
      this.Queue();
      //Show allQueue Details
      this.allShowQueue();
      //FormGroup of Queue Number
      this.QueueNumber();
      //Get All Publisher 
      if(this.alluser.role=='admin'){
        this.ispublisher=true
      this.publiserserive.getManagePublisher().subscribe((res: Response) => {
        // console.log(res);
        this.publisher = res['user'];
        for (var publisher of this.publisher) {
          if (publisher.role == 'publisher') {
            let data = {
              'publisher_name': publisher.fullname,
              'pub_id': publisher.uid,
            }
            this.dropdownpublisher.push(data);
          }
        }


      })
    }else{
      this.ispublisher=false;
    }

  }

  //====================================== Queue Details ===============================================
  //Show and Hide Queue  UI
  queuenumber: boolean = false;
  button:any;
  addqueue() {
    // alert();
    this.submitted3 = false;
    this.button="Add";
    this.ManageQueue.reset();
    this.queuenumber = !this.queuenumber;
  }
  showmethod1: any;

  //Show All Queue Details
  allShowQueue() {
    this.data = [];
    this.services.getQueue().subscribe((res: Response) => {
      //console.log(res);
      //this.data = res['queue'];
      for (var i of res['queues']) {
        if ( this.alluser.role == 'admin') {
          let data1 = {
            'address': i.address,
            'buffer_time': i.buffer_time,
            'queue_id': i.queue_id,
            'contact': i.contact,
            'created_at': i.created_at,
            'email': i.email,
            'name': i.name,
            'price_per_call': i.price_per_call,
            'role': i.role,
            'status': i.status,
            'pub_id':i.pub_id,
            'publisherName':i.publisherName,
          }
          this.data.push(data1);
        }else{
          if(i.pub_id == this.alluser.uid ){
            let data1 = {
              'address': i.address,
              'buffer_time': i.buffer_time,
              'queue_id': i.queue_id,
              'contact': i.contact,
              'created_at': i.created_at,
              'email': i.email,
              'name': i.name,
              'price_per_call': i.price_per_call,
              'role': i.role,
              'status': i.status,
              'pub_id':i.pub_id,
              'publisherName':i.publisherName,
            }
            this.data.push(data1);
          }
        }
      }
      this.data.reverse();
      if (this.data == '') {
        this.showmethod1 = "no data";
      } else {
        this.showmethod1 = "";
      }
    })
  }

  //Conforimed Password Match
  MustMatch(controlName: string, matchingControlName: string) {
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

  //FormGroup Of Queue
  Queue() {
    let publisher
    if(this.alluser.role=='admin'){
      publisher=Validators.required;
      
    }else{
      publisher='';
      
    }
    this.ManageQueue = this.formBuilder.group({
      name: [this.editdata.name, Validators.required],
      email: [this.editdata.email, [Validators.required, Validators.email]],
      address: [this.editdata.address, Validators.required],
      contact: [this.editdata.contact, Validators.required],
      price_per_call: [this.editdata.price_per_call, Validators.required],
      buffer_time: [this.editdata.buffer_time, Validators.required],
      //publisher: [this.editdata.pub_id, publisher],
      confirmPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      id: [this.editdata.queue_id]


    }, {
        validator: this.MustMatch('password', 'confirmPassword'),

      });
  }

  //Submit Of Queue Details
  onSubmit4() {
    this.submitted3 = true;
    if (this.ManageQueue.invalid) {
      return;
    }
    this.loading1 = true;
    this.submitbutton1 = false;
    let id=0;
    // if(this.alluser.role=="admin"){
    //   id=this.ManageQueue.controls.publisher.value;
    // }else{
    //   id=this.alluser.uid;
    // }
    let submit = {
      'name': this.ManageQueue.controls.name.value,
      'pub_id': id,
      'address': this.ManageQueue.controls.address.value,
      'email': this.ManageQueue.controls.email.value,
      'contact': this.ManageQueue.controls.contact.value,
      'password': this.ManageQueue.controls.password.value,
      'price_per_call': this.ManageQueue.controls.price_per_call.value,
      'buffer_time': this.ManageQueue.controls.buffer_time.value,

    }
    if (this.ManageQueue.controls.id.value == '' || this.ManageQueue.controls.id.value == undefined) {
      let QueueEmailCheck= this.data.find(data=>data.email==this.ManageQueue.controls.email.value)
      if(QueueEmailCheck){
       this.loading1 = false;
       this.messageheadererror = "Email Already Exits";
       setTimeout(() => {    //<<<---    using ()=> syntax
         this.messageheadererror = "";
       }, 5000);
         return;
       }
      this.services.postQueue(submit).subscribe((res: Response) => {
        this.loading1 = false;
        this.submitbutton1 = true;
        this.statuscode = res['status'];
        if (this.statuscode == 'success') {
          this.allShowQueue();
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
        this.queuenumber = !this.queuenumber;
      })
    } else {
      let QueueEmailCheck= this.data.find(data=>data.email==this.ManageQueue.controls.email.value && this.ManageQueue.controls.id.value!=data.queue_id)
      if(QueueEmailCheck){
       this.loading1 = false;
       this.messageheadererror = "Email Already Exits";
       setTimeout(() => {    //<<<---    using ()=> syntax
         this.messageheadererror = "";
       }, 5000);
         return;
       }
      this.services.postQueueByID(this.ManageQueue.controls.id.value, submit).subscribe((res: Response) => {
        this.loading1 = false;
        this.submitbutton1 = true;
        this.statuscode = res['status'];
        if (this.statuscode == 'success') {
          this.allShowQueue();
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
        this.queuenumber = !this.queuenumber;
      })
    }

  }

  //get Error of Queue
  get queuearray() { return this.ManageQueue.controls; }

  //Edit Queue Details
  editqueue(id) {

    this.services.getQueueById(id).subscribe((res: Response) => {
      ;
      this.editdata = res['queue'];
      this.Queue();
    })
    this.button="Edit";
    this.queuenumber = !this.queuenumber;
   

  }

  //Delete Queue Details
  delete(id) {
    this.services.deleteQueue(id).subscribe((res: Response) => {
      this.statuscode = res['status'];
      if (this.statuscode == 'success') {
        this.allShowQueue();
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

    })
  }
  //====================================== End Of Queue Details ===============================================
  //====================================== Queue Number ===============================================



  //FormGroup QueueNumber
  QueueNumber() {
    this.ManageQueueNumber = this.formBuilder.group({
      number: ['', Validators.required],


    })
  }

  //Get Error Validation of Queue Number
  get Queuenumbervalid() { return this.ManageQueueNumber.controls; }


  number: boolean = false;
  showmethod: any;
  getQueuenumber: any = [];
  numberdata: any;

  //Hide and Show Of Queue Number 
  managenumber(id) {

    if (id != undefined) {
      if (id != 0) {
        this.showmethod = "loading";
        this.queueid = id
        this.allQueuenumber();
      }
    }
    this.number = !this.number
  }

  //Show all Queue Number 
  allQueuenumber() {
    this.getQueuenumber = [];
    this.services.getQueueNumber().subscribe((res: Response) => {
      this.numberdata = res['queueNumber'];
      for (var i of this.numberdata) {
        if (i.queue_id == this.queueid) {
          let num = {
            'id': i.queue_id,
            'capping': i.capping,
            'number': i.number,
            'status': i.status,
            'objectId': i._id
          }
          this.getQueuenumber.push(num);

        }

      }
      if (this.getQueuenumber == '') {
        this.showmethod = "no data";
      } else {
        this.showmethod = "";
      }
    })
  }

  //Submit Queue Number 
  Queuenumbersubmit() {
    this.submitted1 = true;
    if (this.ManageQueueNumber.invalid) {
      return;
    }
    let submit = {
      'queue_id': this.queueid,
      'number': this.ManageQueueNumber.controls.number.value,
    }
    this.services.postAddQueueNumber(submit).subscribe((res: Response) => {
      this.statuscode = res['status'];
      if (this.statuscode == 'success') {
        this.allQueuenumber();
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


    })
  }

  //Delete Queue Number
  deletenumber(id) {
    this.services.deleteQueueNumber(id).subscribe((res: Response) => {
      this.statuscode = res['status'];
      if (this.statuscode == 'success') {
        this.allQueuenumber();
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
    })
  }
  //====================================== End Of Queue Number ===============================================

}
