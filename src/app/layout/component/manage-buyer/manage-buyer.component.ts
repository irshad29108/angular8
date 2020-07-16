import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ManageBuyersService } from 'src/app/servies/user/manage-buyers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ManagePublisherService } from 'src/app/servies/user/manage-publisher.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-buyer',
  templateUrl: './manage-buyer.component.html',
  styleUrls: ['./manage-buyer.component.css']
})

export class ManageBuyerComponent implements OnInit {

  data: any = []
  showpub=false;
  messageheader: any;
  messageheadererror: any;
  loading: boolean = false;
  submitbutton: boolean = true;
  loading1: boolean = false;
  submitbutton1: boolean = true;
  getpubname
  dropdownpublisher: any = [];
  submitted = false;
  ManageBuyers: FormGroup;
  ManageBuyersNumber: FormGroup;
  selected: any;
  alwaysShowCalendars: boolean;
  getbuyernumber: any = [];
  publisher: any;
  submit: {};
  ispublisher = false;
  buyerdetails: any = [];
  name: string;
  contact: string;
  email: string;
  price: string;
  buyer_id: any;
  number: any;
  statuscode: any;
  showmethod: any;
  alluser: any;
  pub:any=[];
  publisherdropdown: any = "Select Publisher";
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


  constructor(public service: ManageBuyersService, private formBuilder: FormBuilder, public publiserserive: ManagePublisherService,private toastr: ToastrService) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.alluser = JSON.parse(localStorage.getItem('username'));


    //formGroup of Buyer Number
    this.buyernumbersend();

    //Show all Buyers
    this.allbuyershow();

    //FormGroup of Buyer
    this.allshowdata();

    //All Publisher show
    if (this.alluser.role == 'admin') {
      this.showpub=true;
      this.ispublisher = true
      this.publiserserive.getManagePublisher().subscribe((res: Response) => {
        // console.log(res);
        this.publisher = res['user'];
        for (var publisher of this.publisher) {
          if (publisher.role == 'publisher') {
            let data = {
              'publisher_name': publisher.fullname,
              'pub_id': publisher.uid,
            }
            let data1 = {
              'id': publisher.uid,
              'text': publisher.fullname
            }
            this.pub.push(data1)
            
            this.dropdownpublisher.push(data);
          }
         
        }
        this.publisher = this.pub;


      })
    } else {
      this.ispublisher = false;
    }


  }
  resetpublisher(){
    this.publisherdropdown= "Select Publisher";
  }

  //==================================== Buyer Number ===================================================

  //FormGroup of Buyer Number
  buyernumbersend() {
    this.ManageBuyersNumber = this.formBuilder.group({
      number: ['', Validators.required],
      capping: ['', Validators.required],
      global_cap: ['', Validators.required],
      queue: [''],
    })
  }

  //Hide and show Buyer Number UI
  buyernumber: boolean = false;
  managenumber(id) {
    this.submitted1=false;
    if (id != 'not_user') {

      this.buyer_id = id;
      this.ManageBuyersNumber.controls.number.enable();
      this.ManageBuyersNumber.controls.number.setValue('')
      this.ManageBuyersNumber.controls.capping.setValue('')
      this.allbuyernumber();
    } else {
      this.submitbutton1=true;
      this.ManageBuyersNumber.reset();
    }

    // alert();
    this.buyernumber = !this.buyernumber;
  }

  //get Error of Buyer Number
  get buyernumbervalid() {
    return this.ManageBuyersNumber.controls;
  }

  //Submit Buyer Number Details
  submitted1 = false;
  buyernumbersubmit() {
    this.submitted1 = true;
    if (this.ManageBuyersNumber.invalid) {
      return;
    }
    this.loading1 = true;
    
    if(this.submitbutton1==false){
      let submit = {
        'number': this.ManageBuyersNumber.controls.number.value,
        // 'buyer_id': this.buyer_id,
        // 'queue': this.ManageBuyersNumber.controls.queue.value,
        'capping': this.ManageBuyersNumber.controls.capping.value,
        'global_cap': this.ManageBuyersNumber.controls.global_cap.value,
  
      }
      this.service.postEditCapping(submit).subscribe((res: Response) => {
        this.loading1 = false;
        this.submitbutton1 = true;
        this.submitted1=false;
        this.ManageBuyersNumber.controls.number.enable();
        this.ManageBuyersNumber.controls.number.setValue('')
        this.ManageBuyersNumber.controls.capping.setValue('')
        this.ManageBuyersNumber.controls.global_cap.setValue('')
        //console.log(res);
        this.statuscode == res['status']
        if (this.statuscode == 'success') {
  
          this.messageheader = res['message'];
          setTimeout(() => {
            this.messageheader = "";
  
          }, 5000);
        } else {
          this.messageheadererror = res['message'];
          setTimeout(() => {
            this.messageheadererror = "";
          }, 5000);
        }
        this.allbuyernumber()
      });
    }else{
      let submit = {
        'number': this.ManageBuyersNumber.controls.number.value,
        'buyer_id': this.buyer_id,
        'queue': this.ManageBuyersNumber.controls.queue.value,
        'capping': this.ManageBuyersNumber.controls.capping.value,
        'global_cap': this.ManageBuyersNumber.controls.global_cap.value,
  
      }
      this.service.postBuyernumber(submit).subscribe((res: Response) => {
        this.loading1 = false;
        this.submitbutton1 = true;
       
        //console.log(res);
        this.statuscode == res['status']
        if (this.statuscode == 'success') {
          this.ManageBuyersNumber.controls.number.setValue('')
          this.ManageBuyersNumber.controls.capping.setValue('')
          this.ManageBuyersNumber.controls.global_cap.setValue('')
          this.submitted1=false;
          this.messageheader = res['message'];
          setTimeout(() => {
            this.messageheader = "";
  
          }, 5000);
        } else {
          this.messageheadererror = res['message'];
          setTimeout(() => {
            this.messageheadererror = "";
          }, 5000);
        }
        this.allbuyernumber()
      });
    }
    
    

  }
  //Show All Buyer Number 
  allbuyernumber() {
    this.getbuyernumber = [];
    console.log(this.getbuyernumber);
    this.showmethod = "loading"
    this.service.getBuyerNumberByid().subscribe((res: Response) => {
      this.number = res['buyerNumber'];
      for (var i of this.number) {
        if (i.buyer_id == this.buyer_id) {
          let num = {
            'number': i.number,
            'capping': i.capping,
            'global_cap': i.global_cap,
            'queue': i.queue,
            'buyer_id': i._id
          }
          this.getbuyernumber.push(num);

        }

      }
      if (this.getbuyernumber == '') {
        this.showmethod = "no data";
      } else {
        this.showmethod = "";
      }

    })
  }

  //Delete Buyer Number
  deletenumber(id) {
    this.service.deleteBuyernumber(id).subscribe((res: Response) => {
      //this.buyernumber = !this.buyernumber;  
      console.log(res);
      this.statuscode = res['status']
      if (this.statuscode == 'success') {
        this.allbuyernumber();
        this.messageheader = res['message'];
        setTimeout(() => {
          this.messageheader = "";

        }, 5000);
      } else {
        this.messageheadererror = "Error to Updating buyer ";
        setTimeout(() => {
          this.messageheadererror = "";
        }, 5000);
      }

    })
  }
  editBuyerCapping(number,capping,global_cap){
    this.ManageBuyersNumber.reset();
    this.submitbutton1=false;
    this.ManageBuyersNumber.controls.number.disable();
    this.ManageBuyersNumber.controls.number.setValue(number)
    this.ManageBuyersNumber.controls.capping.setValue(capping)
    this.ManageBuyersNumber.controls.global_cap.setValue(global_cap)

    
  }
  //==================================== End of Buyer Number ===================================================

  //==================================== Buyer Details ===================================================

  //Hide and show Buyer UI
  button: any;
  clickadd() {
    // alert();
    this.button = "Add";
    this.ManageBuyers.reset();
    this.add = !this.add;
  }

  //Submit Buyer Details
  onSubmit() {
    this.submitted = true;
    if (this.ManageBuyers.invalid) {
      return;
    }
    this.loading = true;
    this.submitbutton = false;
    let buyer_id = '';
    if (this.ManageBuyers.controls.buyer_id.value != '' || this.ManageBuyers.controls.buyer_id.value != undefined) {
      buyer_id = this.ManageBuyers.controls.buyer_id.value;
    }
    let id = '';
    if (this.alluser.role == "admin") {
      id = this.ManageBuyers.controls.publisher.value;
    } else {
      id = this.alluser.uid;
    }
    // console.log(this.alluser);
    this.submit = {
      'name': this.ManageBuyers.controls.name.value,
      'pub_id': id,
      'address': this.ManageBuyers.controls.address.value,
      'email': this.ManageBuyers.controls.email.value,
      'contact': this.ManageBuyers.controls.contact.value,
      'password': this.ManageBuyers.controls.password.value,
      'price_per_call': this.ManageBuyers.controls.price_per_call.value,
      'buffer_time': this.ManageBuyers.controls.buffer_time.value,
      'role': 'buyer'
    }

    if (buyer_id == '' || buyer_id == null) {
      let BuyerEmailCheck= this.data.find(data=>data.email==this.ManageBuyers.controls.email.value)
      if(BuyerEmailCheck){
       this.loading = false;
       this.messageheadererror = "Email Already Exits";
       setTimeout(() => {    //<<<---    using ()=> syntax
         this.messageheadererror = "";
       }, 5000);
         return;
       }
      this.service.postBuyersPublisher(this.submit).subscribe((res: Response) => {
        this.loading = false;
        this.submitbutton = true;
        this.statuscode = res['status']
        this.add = !this.add;
        console.log(res);
        if (this.statuscode == 'success') {

          this.messageheader = res['message'];
          setTimeout(() => {
            this.messageheader = "";

          }, 5000);
        } else {
          this.messageheadererror = "Error to adding buyer ";
          setTimeout(() => {
            this.messageheadererror = "";
          }, 5000);
        }

        this.allbuyershow();
      })
    } else {
      let BuyerEmailCheck= this.data.find(data=>data.email==this.ManageBuyers.controls.email.value && data.buyer_id!=buyer_id)
      if(BuyerEmailCheck){
       this.loading = false;
       this.messageheadererror = "Email Already Exits";
       setTimeout(() => {    //<<<---    using ()=> syntax
         this.messageheadererror = "";
       }, 5000);
         return;
       }
      this.service.updateBuyer(this.submit, buyer_id).subscribe((res: Response) => {
        this.loading = false;
        this.submitbutton = true;
        this.add = !this.add;
        this.statuscode = res['status']
        if (this.statuscode == 'success') {

          this.messageheader = res['message'];
          setTimeout(() => {
            this.messageheader = "";

          }, 5000);
        } else {
          this.messageheadererror = "Error to Updating buyer ";
          setTimeout(() => {
            this.messageheadererror = "";
          }, 5000);
        }
        this.allbuyershow();
      })
    }
  }

  //FormGroup of Buyer
  allshowdata() {
    let publisher: any
    let publishervalue: any;
    if (this.alluser.role == 'admin') {
      publisher = Validators.required;

    } else {
      publisher = '';

    }
    this.ManageBuyers = this.formBuilder.group({
      name: [this.buyerdetails.name, Validators.required],
      email: [this.buyerdetails.email, [Validators.required, Validators.email]],
      address: [this.buyerdetails.address, Validators.required],
      contact: [this.buyerdetails.contact, Validators.required],
      price_per_call: [this.buyerdetails.price_per_call, Validators.required],
      buffer_time: [this.buyerdetails.buffer_time, Validators.required],
      publisher: [this.buyerdetails.pub_id, publisher],
      confirmPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      buyer_id: [this.buyerdetails.buyer_id]

    }, {
      validator: this.MustMatch('password', 'confirmPassword'),

    });
  }

  //Get Error of Buyer
  get buyer() { return this.ManageBuyers.controls; }

  //Confirmed Password match of Buyer
  MustMatch(controlName: string, matchingControlName: string) {
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

  //Show All Buyer Details
  showmethod1: any;
  allbuyershow() {
    this.data = [];
    this.service.getAllBuyers().subscribe((res: Response) => {
      // this.data=res['buyer'];
      this.showmethod1 = "loading"
      for (var i of res['buyers']) {
        if (this.alluser.role == 'admin') {
          let data1 = {
            'address': i.address,
            'buffer_time': i.buffer_time,
            'buyer_id': i.buyer_id,
            'contact': i.contact,
            'created_at': i.created_at,
            'email': i.email,
            'name': i.name,
            'price_per_call': i.price_per_call,
            'role': i.role,
            'status': i.status,
            'publisherName': i.publisherName,
            'pub_id':i.pub_id,
          }
          this.data.push(data1);
        } else {
          if (i.pub_id == this.alluser.uid) {
            let data1 = {
              'address': i.address,
              'buffer_time': i.buffer_time,
              'buyer_id': i.buyer_id,
              'contact': i.contact,
              'created_at': i.created_at,
              'email': i.email,
              'name': i.name,
              'price_per_call': i.price_per_call,
              'role': i.role,
              'status': i.status,
              'publisherName': i.publisherName,
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

      //console.log(this.data);

    })
  }

  //Edit Buyer Details
  editbuyer(id) {
    this.submitbutton1=true;
    this.service.editBuyerid(id).subscribe((res: Response) => {
      this.button = "Edit";
      this.add = !this.add;
      this.buyerdetails = res['buyer'];
      this.allshowdata();
    })
  }

  //Delete Buyer Detail
  delete(id) {
    this.service.deleteBuyer(id).subscribe((res: Response) => {
      console.log(res);
      this.statuscode = res['status']
      if (this.statuscode == 'success') {
        this.allbuyershow();
        this.messageheader = res['message'];
        setTimeout(() => {
          this.messageheader = "";

        }, 5000);
      } else {
        this.messageheadererror = "Error to Updating buyer ";
        setTimeout(() => {
          this.messageheadererror = "";
        }, 5000);
      }

    })
  }
  statuschange(id, status) {
    let changestatus = {
      'status': status
    }
    this.toastr.success('Status', status +' SucessFully');
    // console.log(changestatus);
    this.service.postBuyerStatus(id, changestatus).subscribe((res: Response) => {
      console.log(res);

    })
  }
  //==================================== End of Buyer Details ===================================================
  //==================================== Filter Details ===================================================

  //Show and hide Filter Details
  status: boolean = false;
  clickFilter() {
    // alert();
    this.status = !this.status;
  }
  add: boolean = false;


  setpassword: boolean = false;
  setPassword() {
    // alert();
    this.setpassword = !this.setpassword;
  }



  selectedFilter: string = '';

  filtr1: boolean = false;
  filtr2: boolean = false;
  filtr3: boolean = false;
  filtr4: boolean = false;
  filtr5: boolean = false;

  selectChangeFilter(event: any) {
    //update the ui
    let optlent = event.target.options.length;
    let text = event.target.options.selectedIndex;
    this.selectedFilter = event.target.value;

    for (let i = 1; i < optlent; i++) {
      // console.log(this.fliterList[i-1]);
      let statIndx = "filtr" + i;

      if (i == text) {
        console.log(statIndx);
        this[statIndx] = true;
      } else {

        //  this[statIndx] = false;
      }
    }


  }


  filter(data1, event) {
    console.log(data1);
    if (event.target.value != '') {
      if (data1 == "Name") {

        this.data = this.data.filter(res => {
          console.log(res);
          return res.name.toLowerCase().match(event.target.value.toLowerCase())
        });
      }
      if (data1 == "Contact") {
        this.data = this.data.filter(res => {
          return res.contact.toLowerCase().match(event.target.value.toLowerCase())
        });
      }
      if (data1 == "Price") {
        this.data = this.data.filter(res => {
          return res.price_per_call.toString().match(event.target.value.toString())
        });
      }
      if (data1 == "Status") {
        this.data = this.data.filter(res => {
          return res.status.toLowerCase().match(event.target.value.toLowerCase())
        });


        //  if(event.target.value=='0'){
        //   this.AllTfnnumber();
        //  }


      }
    } else {
      this.allbuyershow();
    }
  }
  closefiltr(num) {
    // this[num] = false;
    if (this[num] == this.filtr1) {
      this.name = '';
    }
    if (this[num] == this.filtr2) {
      this.contact = '';
    }
    if (this[num] == this.filtr3) {
      this.email = ''
    }
    // if (this[num] == this.filtr4) {
    //   this.price = ''
    // }
    // if (this[num] == this.filtr5) {
    //   this.status = false
    // }

  }
  resetfilter(){
    this.name = '';
    this.contact = '';
    this.email = '';
    
  }
  //==================================== End of Filter ===================================================

  // transform(value){
  //   return console.log(this.publiserserive.getManagePublisher().pipe(map(ids=>ids.filter(publisher=>publisher.uid==value))));
  // }

}
