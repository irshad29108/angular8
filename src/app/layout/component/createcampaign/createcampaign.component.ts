import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublisherModalService } from 'src/app/servies/modal/publisher-modal.service';
import { ManagePublisherService } from 'src/app/servies/user/manage-publisher.service';
import { RoleService } from 'src/app/servies/user/role.service';
import { ManageBuyersService } from 'src/app/servies/user/manage-buyers.service';
import { TfnService } from 'src/app/servies/user/tfn.service';
import { CampaignService } from 'src/app/servies/campaign/campaign.service';
import { ToastrService } from 'ngx-toastr';
import { Select2OptionData } from 'ng-select2';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-createcampaign',
  templateUrl: './createcampaign.component.html',
  styleUrls: ['./createcampaign.component.css']
})
export class CreatecampaignComponent implements OnInit {
  addCampaign: FormGroup;
  ManagePublisher: FormGroup;
  ManageBuyers: FormGroup;
  public timezone: Array<Select2OptionData>;
  timezoneArray: any;
  timeZone: any = [];
  TFN: FormGroup;
  ManageBuyersNumber: FormGroup;
  submitted = false;
  submittedBuyer = false;
  submittedBuyerNumber = false;
  submittedTfn = false;
  submittedCampaign = false
  allpulisherdrop: any
  public allpulisher: Array<Select2OptionData>;
  allRole: any;
  allBuyer: any = [];
  alltfn: any;
  BuyerNumberDropdown: any = [];
  selectedItems: any = [];
  selectedPriorityItems: any = [];
  buyerDropdownSettings: {};
  buyerSettings = {};
  settings: {};
  selecteddata: any = [];
  buyernumberPeority: any = [];
  itemList = [];
  showBuyerNumber = false;
  queue = true
  alluser: any;
  pubdrop: any;
  bufferTime: number;
  pricePerCall: number;
  name: string;


  constructor(public services: CampaignService, public formBuilder: FormBuilder, public publisherModel: PublisherModalService, private publisherservice: ManagePublisherService, public roleservice: RoleService, public Buyerservice: ManageBuyersService, public tfnservice: TfnService, private toastr: ToastrService, private http: HttpClient, public routepart: Router) { }

  // ============================================================== 
  //  TimeZone,Publisher,tfn,buyer Show 
  //  ============================================================== 

  async ngOnInit() {

    // +++++++++++++++TimeZone Api+++++++++++++++++++++++++++++

    this.http.get("assets/zone.json").subscribe(data => {
      //console.log(data);
      this.timezoneArray = data;
      for (var zone of this.timezoneArray) {
        let Array = {
          'id': zone.abbr,
          'text': zone.value + '' + zone.text
        }
        this.timeZone.push(Array)
      }
      this.timezone = this.timeZone;
      // this.products = data;
    })
    // +++++++++++++++End TimeZone Api+++++++++++++++++++++++++++++
    this.alluser = JSON.parse(localStorage.getItem('username'));

    // ============================================================== 
    //  Publisher Login Buyer And Tfn Show
    //  ============================================================== 

    if (this.alluser.role == 'publisher') {

      this.itemList = [];
     await this.Buyerservice.getBuyerByPubId(this.alluser.uid).subscribe((res: Response) => {
        this.allBuyer = res['buyers'].map(({ buyer_id, name }) => {
          let buyer = {
            id: buyer_id,
            itemName: name,
          }
          return buyer;
        })

      })
      await this.services.getTfnByID(this.alluser.uid).subscribe((res: Response) => {
        //console.log(res);

        for (var i of res['tfn']) {
          if (i.status == 'available') {
            let data = {
              'id': i.tfn,
              'itemName': i.tfn
            }
            this.itemList.push(data);
            //console.log(this.itemList);
          }

        }

      })
    }


    /*await this.Buyerservice.getBuyerNumberByid().subscribe((res: Response) => {
      this.allBuyerNumbers = res['buyerNumber']
    })*/

    // ============================================================== 
    //  End Publisher Login Buyer And Tfn Show
    //  ============================================================== 

    // +++++++++++++++Add Publisher Form And Validation+++++++++++++++++++++++++++++
    this.addPublisher();
    // +++++++++++++++End Publisher Form And Validation+++++++++++++++++++++++++++++

    // +++++++++++++++Add Buyer Form And Validation+++++++++++++++++++++++++++++
    this.addBuyer();
    // +++++++++++++++End Buyer Form And Validation+++++++++++++++++++++++++++++

    // +++++++++++++++Add Campaign Form And Validation+++++++++++++++++++++++++++++
    this.addCampaignForm();
    // +++++++++++++++End Campaign Form And Validation+++++++++++++++++++++++++++++

    // +++++++++++++++Add Buyer Number Form And Validation+++++++++++++++++++++++++++++
    this.addBuyerNumber();
    // +++++++++++++++End Buyer Number Form And Validation+++++++++++++++++++++++++++++

    // +++++++++++++++Add Tfn Form And Validation+++++++++++++++++++++++++++++
    this.addTfn();
    // +++++++++++++++End Tfn Form And Validation+++++++++++++++++++++++++++++

    // +++++++++++++++All Publisher Show+++++++++++++++++++++++++++++
    this.allPulisherShow();
    // +++++++++++++++End All Publisher Show+++++++++++++++++++++++++++++

    // +++++++++++++++All Role Show+++++++++++++++++++++++++++++
    this.getAllRole();
    // +++++++++++++++End All Role Show+++++++++++++++++++++++++++++

    this.buyerDropdownSettings = {
      singleSelection: false,
      text: "Select Buyer Number",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3,
      classes: "myclass custom-class",
    };
    this.settings = {
      text: "Select TFNS",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3,
      classes: "myclass custom-class"
    };
    this.buyerSettings = {
      singleSelection: false,
      text: "Select Buyer",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes: "myclass custom-class"
    }
  }

  // ============================================================== 
  //  End TimeZone,Publisher Show 
  //  ============================================================== 

  valid: any = '';

  // ==============================================================
  // Add Campaign Form And Validation
  // ==============================================================

  addCampaignForm() {

    if (this.alluser.role == 'admin') {
      this.valid = Validators.required;
    }

    //console.log(this.valid)
    this.addCampaign = this.formBuilder.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      publisher: ['', this.valid],
      buyer: [''],
      buffer_time: ['', Validators.required],
      price_per_call: ['', Validators.required],
      buyerNumber: [''],
      Tfn: ['', Validators.required],
      route: ['', Validators.required],
      queue: [''],

    });
  }
  // ==============================================================
  // End Campaign Form And Validation
  // ==============================================================

  // ==============================================================
  // Add Publisher Form And Validation
  // ==============================================================
  addPublisher() {
    this.ManagePublisher = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tfn: ['', Validators.required],
      contact: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],

    }, {
      validator: this.MustMatchPublisher('password', 'confirmPassword'),

    });
  }
  MustMatchPublisher(controlName: string, matchingControlName: string) {
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
  // ==============================================================
  // End Publisher Form And Validation
  // ==============================================================

  // ==============================================================
  // Add Buyer Form And Validation
  // ==============================================================
  addBuyer() {
    let valid
    if (this.alluser.role == 'admin') {
      valid = Validators.required
    } else {
      valid = '';
    }
    this.ManageBuyers = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      contact: ['', Validators.required],
      price_per_call: ['', Validators.required],
      buffer_time: ['', Validators.required],
      publisher: ['', valid],
      confirmPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // buyer_id: [this.buyerdetails.buyer_id]

    }, {
      validator: this.MustMatch('password', 'confirmPassword'),

    });
  }

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
  // ==============================================================
  // End Buyer Form And Validation
  // ==============================================================

  // ==============================================================
  // Add Tfn Form And Validation
  // ==============================================================
  addTfn() {
    this.TFN = this.formBuilder.group({
      tfn_number: ['', Validators.required],
      price_per_tfn: ['', Validators.required],


    });
  }

  // ==============================================================
  // End Tfn Form And Validation
  // ==============================================================

  // ==============================================================
  // Add Buyer Number Form And Validation
  // ==============================================================
  addBuyerNumber() {
    this.ManageBuyersNumber = this.formBuilder.group({
      number: ['', Validators.required],
      capping: ['', Validators.required],
      buyer_id: ['', Validators.required],
    })
  }

  // ==============================================================
  // End Buyer Number Form And Validation
  // ==============================================================

  // ==============================================================
  // Publisher Validation Check
  // ==============================================================

  get f() { return this.ManagePublisher.controls; }
  // ==============================================================
  // End Publisher Validation Check
  // ==============================================================

  // ==============================================================
  // Buyer Validation Check
  // ==============================================================
  get buyer() { return this.ManageBuyers.controls; }
  // ==============================================================
  // End Buyer Validation Check
  // ==============================================================

  // ==============================================================
  // Tfn Validation Check
  // ==============================================================
  get gettfn() { return this.TFN.controls };
  // ==============================================================
  // End Tfn Validation Check
  // ==============================================================

  // ==============================================================
  // Buyer Number Validation Check
  // ==============================================================
  get buyernumbervalid() { return this.ManageBuyersNumber.controls }
  // ==============================================================
  // End Buyer Number Validation Check
  // ==============================================================

  // ==============================================================
  // Campaign Validation Check
  // ==============================================================
  get camp() { return this.addCampaign.controls };
  // ==============================================================
  // End Campaign Validation Check
  // ==============================================================



  priority: any[] = [
    { id: 0, name: '0' },
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
  ];





  tab: any = 'tab1';

  // ==============================================================
  // Tabs
  // ==============================================================
  nextStep(check) {
    // this.tab = 'tab' + check;
    if (check == 1) {
      this.tab = 'tab' + check;
    }
    this.bufferTime = this.addCampaign.controls.buffer_time.value;
    this.pricePerCall = this.addCampaign.controls.price_per_call.value;
    this.name = this.addCampaign.controls.name.value;

    if (check == 2) {
      if (this.name == '' || this.bufferTime == null || this.pricePerCall == null || this.addCampaign.controls.country.value == '') {

        this.submittedCampaign = true;
        return;
      } else {

        this.submittedCampaign = false;
        this.tab = 'tab' + check;
      }
    }
    if (check == 3) {
      if (this.alluser.role == 'admin') {
        if (this.addCampaign.controls.publisher.value == '' || this.addCampaign.controls.route.value == '') {
          this.submittedCampaign = true;
          return;
        } else {
          this.submittedCampaign = false;
          this.tab = 'tab' + check;
        }
      } else {
        if (this.addCampaign.controls.route.value == '') {
          this.submittedCampaign = true;
          return;
        } else {
          this.submittedCampaign = false;
          this.tab = 'tab' + check;
        }
      }
    }
    if (check == 4) {

      if (this.addCampaign.controls.route.value == '1') {
        //console.log(this.addCampaign.controls.buyer.value);
        //console.log(this.buyernumberPeority);
        if (this.addCampaign.controls.buyer.value == '' || this.buyernumberPeority == '') {
          this.submittedCampaign = true;
          return;
        }
        else {
          this.submittedCampaign = false;
          this.tab = 'tab' + check;
        }
      } else {
        if (this.addCampaign.controls.queue.value == '') {
          this.submittedCampaign = true;
          return;
        }
        else {
          this.submittedCampaign = false;
          this.tab = 'tab' + check;
        }
      }
    }
    if (check == 5) {
      if (this.addCampaign.controls.Tfn.value == '') {
        this.submittedCampaign = true;
        return;
      }
    }
    // if(check==1){
    //   this.tab = 'tab1';
    // }else if(check==2){
    //   this.tab = 'tab2';
    // }else{
    //   this.tab = 'tab3';
    // }    

  }
  // ==============================================================
  // End Tabs
  // ==============================================================
  private selectedLink: string = "me";
  openModal(id: string) {
    this.publisherModel.open(id);
  }
  closeModal(id: string) {
    this.publisherModel.close(id);
  }

  // ==============================================================
  // Submit Publisher 
  // ==============================================================
  onSubmitPublisher() {
    this.submitted = true;
    if (this.ManagePublisher.invalid) {
      return;
    }
    let publisher = {
      'fullname': this.ManagePublisher.controls.name.value,
      'email': this.ManagePublisher.controls.email.value,
      'contact': this.ManagePublisher.controls.contact.value,
      'password': this.ManagePublisher.controls.password.value,
      'price_per_tfn': this.ManagePublisher.controls.tfn.value,
      'role': this.ManagePublisher.controls.role.value,
      'status': 'active',

    }
   let pub= this.allpulisherdrop.find(data=>data.email==this.ManagePublisher.controls.email.value)
    if(pub){
      this.toastr.error('Error',"Email Already Exits")
      return;
    }
    this.publisherservice.postManagePublisher(publisher).subscribe((res: Response) => {
      //console.log(res);
      if (res['statusCode'] == "200") {
        this.toastr.success('Add publisher', 'publisher Successfully added')
        this.allPulisherShow();
        this.closeModal('publisher')
      } else {
        this.toastr.error('Error', res['message'])
      }
    })
  }
  // ==============================================================
  // End Submit Publisher 
  // ==============================================================

  // ==============================================================
  // End Submit Buyer 
  // ==============================================================
  onSubmitBuyer() {
    this.submittedBuyer = true;
    if (this.ManageBuyers.invalid) {
      return;
    }

    let id = '';
    if (this.alluser.role == "admin") {
      id = this.ManageBuyers.controls.publisher.value;
    } else {
      id = this.alluser.uid;
    }
    let submit = {
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
    this.Buyerservice.postBuyersPublisher(submit).subscribe((res: Response) => {
      if (res['statusCode'] == "200") {
        this.toastr.success('Add Buyer', 'Buyer  SucessFully added')
        this.getAllBuyer();
        this.closeModal('Buyer')
      } else {
        this.toastr.error('Error', res['message'])
      }

    });

  }
  // ==============================================================
  // End Submit Buyer 
  // ==============================================================

  // ==============================================================
  // Submit Tfn 
  // ==============================================================
  onSubmitTfn() {
    this.submittedTfn = true
    if (this.TFN.invalid) {
      return;
    }
    if (this.alluser.role == 'publisher') {
      this.pubdrop = this.alluser.uid;
    } else {
      this.pubdrop = this.addCampaign.controls.publisher.value;
    }
    let tfnsubmit = {
      'tfn': [this.TFN.controls.tfn_number.value],
      "price_per_tfn": this.TFN.controls.price_per_tfn.value,
      "status": "available",
      "pub_id": this.pubdrop,
      "purchase_date": new Date(),
    }
    this.tfnservice.getTFN(tfnsubmit).subscribe((res: Response) => {
      if (res['statusCode'] == "200") {
        this.itemList = [];
        this.toastr.success('TFN add', 'TFN Successfully added')
        this.services.getTfnByID(this.pubdrop).subscribe((res: Response) => {
          //console.log(res);
          this.closeModal('Tfn');

          for (var i of res['tfn']) {
            if (i.status == 'available') {
              let data = {
                'id': i.tfn,
                'itemName': i.tfn
              }
              this.itemList.push(data);
              //console.log(this.itemList);
            }

          }

        })
        this.tfnservice.getTfnFreepbxAdd(this.TFN.controls.tfn_number.value).subscribe((res: Response) => {
          // console.log(res);
        })
      } else {
        this.toastr.error('Error', res['message'])
      }
    });

  }
  // ==============================================================
  // End Submit Tfn 
  // ==============================================================

  // ==============================================================
  // Submit Buyer Number
  // ==============================================================
  onSubmitBuyerNumber() {
    this.submittedBuyerNumber = true;
    if (this.ManageBuyersNumber.invalid) {
      return;
    }
    let submit = {
      'number': this.ManageBuyersNumber.controls.number.value,
      'buyer_id': this.ManageBuyersNumber.controls.buyer_id.value,
      'queue': 0,
      'capping': this.ManageBuyersNumber.controls.capping.value,


    }
    this.Buyerservice.postBuyernumber(submit).subscribe((res: Response) => {
      if (res['statusCode'] == "200") {
        this.toastr.success('Add Buyer Number ', 'Buyer Number  SucessFully added')
        this.somethingChanged();
        this.closeModal('BuyerNumber');
      } else {
        this.toastr.error('Error', res['message'])
      }

    })
  }
  // ==============================================================
  // End Submit Buyer Number
  // ==============================================================

  // ==============================================================
  // Publisher Show 
  // ==============================================================
  allPulisherShow() {
    this.publisherservice.getManagePublisher().subscribe((publisher: any) => {
      this.allpulisherdrop = publisher['user']
        .filter(applicable => 'admin' != applicable.role)
        .map(({ fullname, uid,email }) => {

          let publisherdrop = {
            'id': uid,
            'text': fullname,
            'email':email,
          };
          return publisherdrop;
        });
      this.allpulisher = this.allpulisherdrop.reverse();
    })
  }
  // ==============================================================
  // End Publisher Show
  // ==============================================================

  // ==============================================================
  //  Role Show
  // ==============================================================
  getAllRole() {
    this.roleservice.getRole().subscribe((res: Response) => {
      this.allRole = res['buyer'];
    })
  }
  // ==============================================================
  // End Role Show
  // ==============================================================

  // ==============================================================
  // Get All Buyer
  // ==============================================================
  getAllBuyer() {
    if (this.alluser.role == 'publisher') {
      this.pubdrop = this.alluser.uid;
    } else {
      this.pubdrop = this.addCampaign.controls.publisher.value;
    }
    this.Buyerservice.getBuyerByPubId(this.pubdrop).subscribe((res: Response) => {
      this.allBuyer = res['buyers'].map(({ buyer_id, name }) => {
        let buyer = {
          id: buyer_id,
          itemName: name,
        }
        return buyer;
      });
      if (this.allBuyer == '') {
        this.allBuyer = 'no data';
      }

      console.log(this.allBuyer);
    })
  }
  // ==============================================================
  // End Get All Buyer
  // ==============================================================

  // ==============================================================
  // Buyer Change Function Call
  // ==============================================================
  somethingChanged() {
    // this.loadingbuyernumber = true;
    this.BuyerNumberDropdown = [];
    this.selectedItems = [];

    if (this.addCampaign.controls.buyer.value != undefined && this.addCampaign.controls.buyer.value != '') {
        this.Buyerservice.getBuyerNumberByid().subscribe((res: Response) => {
        this.BuyerNumberDropdown = [];

        if(res['statusCode'] == "200") {
          res['buyerNumber'].map(({ _id, status, capping, queue, number, global_cap, buyer_id }) => {
              let data = {
                id: number,
                pause_status: status,
                capping: capping,
                queue: queue,
                itemName: number,
                global_cap: global_cap,
                priority: 0,
                buyer_number: number,
                buyer_id: buyer_id,
              }
              let index = this.addCampaign.controls.buyer.value.findIndex(data => data.id == buyer_id)
              if (index != -1) {
                this.BuyerNumberDropdown.push(data)
              }
            })
        }
      })
    }

    //this.loadingbuyernumber = false;

  }
  // ==============================================================
  // End Buyer Change Function Call
  // ==============================================================

  // ==============================================================
  // Publisher Change Function Call
  // ==============================================================
  somethingChanged2() {
    if (this.addCampaign.controls.publisher.value != '') {
      this.itemList = [];
      this.Buyerservice.getBuyerByPubId(this.addCampaign.controls.publisher.value).subscribe((res: Response) => {
        this.allBuyer = res['buyers'].map(({ buyer_id, name }) => {
          let buyer = {
            id: buyer_id,
            itemName: name,
          }
          return buyer;
        });
        
      })


      this.services.getTfnByID(this.addCampaign.controls.publisher.value).subscribe((res: Response) => {
        //console.log(res);

        for (var i of res['tfn']) {
          if (i.status == 'available') {
            let data = {
              'id': i.tfn,
              'itemName': i.tfn
            }
            this.itemList.push(data);
            //console.log(this.itemList);
          }

        }

      })
    }

  }
  // ==============================================================
  // End Publisher Change Function Call
  // ==============================================================

  // ==============================================================
  // Single Buyer Number Select
  // ==============================================================
  onBuyerSelect(item: any) {
    let value = item.target.value.split('-');
    //var checknumber = []
    let checknumber = this.selectedItems.find(x => x.itemName == value[0]);

    if (checknumber != undefined) {

      let data = {
        'buyer_number': value[0],
        'priority': value[1],
        'pause_status': value[2],
        'capping': value[3],
        'global_cap': value[4],
        'queue': value[5],
        'buyer_id': value[6]
      }

      let index: number = this.buyernumberPeority.findIndex(data1 => data1.buyer_number == data.buyer_number);
      if (index !== -1) {
        this.buyernumberPeority.splice(index, 1);
        this.buyernumberPeority.push(data);
      } else {
        this.buyernumberPeority.push(data);
      }
    } else {
      alert("Please Check First Buyer Number");

    }

  }
  // ==============================================================
  // Single Buyer Number Select
  // ==============================================================

  // ==============================================================
  // Single Buyer Number UnSelect
  // ==============================================================
  OnBuyerDeSelect(item: any) {
    let index: number = this.buyernumberPeority.findIndex(data1 => data1.buyer_number == item.buyer_number);
    if (index !== -1) {
      this.buyernumberPeority.splice(index, 1);
    }
    //console.log(item);
  }

  // ==============================================================
  // Single Buyer Number UnSelect
  // ==============================================================

  // ==============================================================
  // Multipule Buyer Number Select
  // ==============================================================
  onBuyerSelectAll(items: any) {
    // let value=items..split('-');
    var checknumber = []
    //checknumber = this.selectedItems.find(x=>x.itemName == value[0]);
    // console.log(this.selectedItems);
    //if(checknumber!=undefined){

    let data = {
      'buyer_number': items.buyer_number,
      'priority': items.priority,
      'pause_status': items.pause_status,
      'capping': items.capping,
      'global_cap': items.global_cap,
      'queue': items.queue,
      'buyer_id': items.buyer_id
    }
    let index: number = this.buyernumberPeority.findIndex(data1 => data1.buyer_number == data.buyer_number);
    if (index !== -1) {
      this.buyernumberPeority.splice(index, 1);
      this.buyernumberPeority.push(data);
    } else {
      this.buyernumberPeority.push(data);
    }
    // }else{
    //   alert("Please Check First Buyer Number");

    // }
  }
  // ==============================================================
  // Multipule Buyer Number Select
  // ==============================================================

  // ==============================================================
  // Multipule Buyer Number UnSelect
  // ==============================================================
  onBuyerDeSelectAll(items: any) {
    // console.log(items);
    this.buyernumberPeority = []
  }
  // ==============================================================
  // Multipule Buyer Number UnSelect
  // ==============================================================

  // ==============================================================
  // Multipule Buyer  Select
  // ==============================================================
  onBuyerSelectAll2(items: any) {
    let data = items.map(({ buyer_number, priority, pause_status, capping, global_cap, queue, buyer_id }) => {
      let allselectbuyer = {
        buyer_number: buyer_number,
        priority: priority,
        pause_status: pause_status,
        capping: capping,
        global_cap: global_cap,
        queue: queue,
        buyer_id: buyer_id
      }
      let index: number = this.buyernumberPeority.findIndex(data => data.buyer_number == allselectbuyer.buyer_number);
      if (index !== -1) {
        this.buyernumberPeority.splice(index, 1);
        this.buyernumberPeority.push(allselectbuyer);
      } else {
        this.buyernumberPeority.push(allselectbuyer);
      }

    })
    // console.log(items);

  }
  // ==============================================================
  // Multipule Buyer Select
  // ==============================================================

  // ==============================================================
  // Tfn Select UnSelect
  // ==============================================================
  onItemSelect(item: any) {
  }
  OnItemDeSelect(item: any) {

  }
  onSelectAll(items: any) {
    // console.log(items);
  }
  onDeSelectAll(items: any) {
    // console.log(items);
  }
  // ==============================================================
  // End Tfn Select UnSelect
  // ==============================================================

  // ==============================================================
  // Buyer Select UnSelect
  // ==============================================================
  onBuyerDropDownSelect(item: any) {

  }
  OnBuyerDropDownDeSelect(item: any) {

  }
  onBuyerDropDownSelectAll(items: any) {

  }
  onBuyerDropDownDeSelectAll(items: any) {

  }
  // ==============================================================
  // End Buyer Select UnSelect
  // ==============================================================
  ChangeRoute() {

    if (this.addCampaign.controls.route.value == 1) {
      this.showBuyerNumber = true;
      this.queue = false
    } else {
      this.showBuyerNumber = false;
      this.queue = true;
    }

  }
  updateTfn(tfn) {

    let tfnsend = {
      'tfn': tfn,
      'status': 'used',
    }
    this.tfnservice.postTfnStatus(tfnsend).subscribe((res: Response) => {
    })

  }



  // ==============================================================
  // Camapign Submit 
  // ==============================================================
  onSubmit() {
    // console.log(this.addCampaign.controls.Tfn.value.map(({ id }) => id));return;
    this.submittedCampaign = true;
    if (this.addCampaign.invalid) {
      return;
    }
    let uid = ''
    if (this.alluser.role == 'publisher') {
      uid = this.alluser.uid;
    } else {
      uid = this.addCampaign.controls.publisher.value;
    }
    let submitCampign = {};
    if (this.addCampaign.controls.queue.value != '' && this.addCampaign.controls.queue.value != null) {

      submitCampign = {
        'pub_id': uid,
        'camp_name': this.addCampaign.controls.name.value,
        'buffer_time': this.addCampaign.controls.buffer_time.value,
        'buyer_id': 0,
        'price_per_call': this.addCampaign.controls.price_per_call.value,
        'time_zone': this.addCampaign.controls.country.value,
        'read_only': 1,
        'inside_route': this.addCampaign.controls.queue.value,
        'tfns': this.addCampaign.controls.Tfn.value.map(({ id }) => id),
      }
    } else {


      // console.log(this.addCampaign.controls.buyerNumber.value)
      if (this.buyernumberPeority == '') {
        alert('please select Buyer Number and priority');
        return;
      }
      submitCampign = {
        'pub_id': uid,
        'camp_name': this.addCampaign.controls.name.value,
        'buffer_time': this.addCampaign.controls.buffer_time.value,
        'buyer_id': this.addCampaign.controls.buyer.value.map(({ id }) => id),
        'price_per_call': this.addCampaign.controls.price_per_call.value,
        'time_zone': this.addCampaign.controls.country.value,
        'read_only': 1,
        'inside_route': '',
        'tfns': this.addCampaign.controls.Tfn.value.map(({ id }) => id),
        'buyer_numbers': this.buyernumberPeority,
      }
    }


    // if (res['statusCode'] == "200") {
    //   this.toastr.success('Add publisher', 'publisher Successfully added')
    //   this.allPulisherShow();
    //   this.closeModal('publisher')
    // } else {
    //   this.toastr.error('Error', res['message'])
    // }

    var alltfns = this.addCampaign.controls.Tfn.value.map(({ id }) => id);
    this.services.postaddcampaign(submitCampign).subscribe((res: Response) => {

      if (res['statusCode'] == "200") {

          if ((res['data']['inside_route'] == '') || (res['data']['inside_route'])) {
            let addno = {
              'queue_no': res['data']['queue_no'],
              //'buyer_no': this.buyernumberPeority.map(({ buyer_number }) => buyer_number).join(","),
              'buyer_no': this.buyernumberPeority.map((res)=>{return "Local/"+res.buyer_number+"@from-queue/n,"+res.priority}),
              'token': 'ymzfMNQVp3yateWs',
              'tfns': alltfns.join(","),
              'queue_name': res['data']['queue_name'],
            }

            this.services.postFreepbxCommon(addno).subscribe((freepbx: any) => {
              if (freepbx['statusCode'] == "200") {
                this.updateTfn(alltfns)
                this.services.getQueueRelod().subscribe((resdat: Response) => {})
                this.routepart.navigate(['/dashboard/campaign/manage'])
              }else{
                this.toastr.error('Error','Queue not updated somthing went wrong')
              }
            })
          }else{
            this.updateTfn(alltfns)
            //this.services.getQueueRelod().subscribe((resdat: Response) => {})
            this.routepart.navigate(['/dashboard/campaign/manage'])
          }

          

            // this.services.getFreePbxAddBuyer(addno).subscribe((res1: Response) => {
            //   var i=res1['statusCode']
            //   if(i=="200"){
            //     this.toastr.success('Status','Buyer Server  SucessFully added')
            //   }else{
            //     this.toastr.error('Error','error')
            //   }
            // })
            // let addFreepbxCampaign = {
            //   'queue_no': res['data']['queue_no'],
            //   'queue_name': res['data']['queue_name'],
            // }


            // this.services.postAddFreepbxCampaign(addFreepbxCampaign).subscribe((res2: Response) => {
            //   console.log(res2);
            //   var i1=res2['statusCode']
            //   if(i1=="200"){
            //     this.toastr.success('Status','Campaign Server  SucessFully added')
            //   }else{
            //     this.toastr.error('Error','Campaign Server  Not working');
            //   }
            // })
            // this.updateTfn(alltfns);
            // this.services.getQueueRelod().subscribe((resdat: Response) => {})
            //this.routepart.navigate(['/dashboard/campaign/manage'])
          //} else {
            // this.updateTfn(alltfns)
            // this.services.getQueueRelod().subscribe((resdat: Response) => {})
            //this.routepart.navigate(['/dashboard/campaign/manage'])
          //}


      }else{
        this.toastr.error('Error', res['message'])
      }


    })
    this.toastr.success('Campaign creation', 'Successfully created your Campaign');
    this.submittedCampaign = false;
    this.addCampaignForm();
    this.tab = 'tab1'

  }
  // ==============================================================
  // End Campaign Submit
  // ==============================================================



}
