import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CampaignService } from 'src/app/servies/campaign/campaign.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ManagePublisherService } from 'src/app/servies/user/manage-publisher.service';
import { ManageBuyersService } from 'src/app/servies/user/manage-buyers.service';
import { TfnService } from 'src/app/servies/user/tfn.service';
import { PublisherModalService } from 'src/app/servies/modal/publisher-modal.service';
import { RoleService } from 'src/app/servies/user/role.service';
import { ToastrService } from 'ngx-toastr';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';
import { ISlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import { DashboardService } from 'src/app/servies/user/dashboard/dashboard.service';
import { Select2OptionData } from 'ng-select2';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-manage-campaigns',
  templateUrl: './manage-campaigns.component.html',
  styleUrls: ['./manage-campaigns.component.css']
})
export class ManageCampaignsComponent implements OnInit {
  alluser: any
  alwaysShowCalendars: boolean;
  submitted = false;
  submittedBuyer = false;
  submittedPublisher = false;
  submittedBuyerNumber = false;
  submittedTfn = false;
  data: any = [];
  starttfn: any;
  public timezone: Array<Select2OptionData>;
  timezoneArray: any;
  timeZone: any = [];
  showmethod = ''
  unAssignTfnNum: any = [];
  datashow: any;
  camp: any;
  campaign_id: any;
  backgroundColor: any
  Campaign: FormGroup;
  ManagePublisher: FormGroup;
  ManageBuyers: FormGroup;
  ManageBuyersNumber: FormGroup;
  TfnNumber: FormGroup
  publisher: any;
  buyerservice: any;
  allBuyerDropdown = []
  dropdownpublisher: any = []
  pub:any=[]
  tfnShow: any = [];
  tfnShowpush: any = []
  selectedItems = [];
  selectedItems1 = [];
  buyernumberPeority: any = [];
  itemList = [];
  allBuyerDropdownMain = [];
  settings = {};
  buyerDropdownSettings = {};
  buyerSettings = {};
  BuyerNumberDropdown: any = []
  selectbuyer: any
  messagestatus: any;
  messageheader: any;
  messageheadererror: any;
  buyerNumberboolean: any = false;
  queueboolean = false;
  allRole: any;
  pubdrop: any;
  buyerdrop = [];
  buyerdroppush = []
  loader = false;
  buyerIdDisplay: any = []
  constructor(public services: CampaignService, private route: ActivatedRoute, public formBuilder: FormBuilder, public publiserserive: ManagePublisherService, public buyerservices: ManageBuyersService, public tfnservice: TfnService, public publisherModel: PublisherModalService, public roleservice: RoleService, private toastr: ToastrService, public dservice: DashboardService, private http: HttpClient, public routepart: Router,private cdRef:ChangeDetectorRef) {
    this.alwaysShowCalendars = true;
  }

  ranges: any = {

    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
  }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [
    { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' }
  ];
  doughnutChartLabels: Label[] = ['BMW', 'Ford', 'Tesla'];
  doughnutChartData: MultiDataSet = [
    [55, 25, 20]
  ];
  doughnutChartType: ChartType = 'doughnut';
  // ==============================================================
  // Show Time Zone And All Form With Validtion Function
  // ============================================================== 
  ngOnInit() {
    this.addPublisher();
    this.getAllRole();
    this.addBuyer();
    this.addBuyerNumber();
    this.addTfn();
    this.http.get("assets/zone.json").subscribe(data => {

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
    var id = this.route.snapshot.paramMap.get('id');
    var camp = id.split("&");
    this.campaign_id = camp[1];
   // console.log(this.campaign_id);
    this.loader = true;
    let datapart = '';

    this.editCampaign();
    this.settings = {
      text: "Select TFNS",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3,
      classes: "myclass custom-class"
    };
    this.buyerDropdownSettings = {
      // singleSelection: false,
      text: "Select Buyer Number",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3,
      classes: "myclass custom-class",
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
    let data = JSON.parse(localStorage.getItem('username'))
    this.alluser = JSON.parse(localStorage.getItem('username'));
    if (data.role == 'admin') {
      this.allPulisherShow();

    } else {

      // this.dropdownpublisher=this.alluser.uid

    }

    this.backgroundColor = "2px solid #eeeeee"
    this.Campaign = this.formBuilder.group({
      campname: ['', Validators.required],
      // title: ['', Validators.required],
      buffer_time: ['', Validators.required],
      price_per_call: ['', Validators.required],
      zone: ['', Validators.required],
      route: ['', Validators.required],
      buyerNumber: [''],
      buyer: [''],
      Tfn: ['', Validators.required],
      queue: [],
      // read_only: ['', Validators.required],
      id: [''],
      // p: [],
      queue_name: [],
      publisher: [],
      queue_number: []
    });


    //this.editCampaign();

  }
  priority: any[] = [
    { id: 0, name: '0' },
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
  ];

  // ==============================================================
  // Buyer change Fuction Call
  // ==============================================================
  somethingChanged() {

    this.BuyerNumberDropdown = [];
    this.selectedItems = [];
    this.selectedItems1 = [];
    this.buyernumberPeority = [];

    //======================Buyer Number show using Buyer====================================//

    if (this.Campaign.controls.buyer.value != undefined && this.Campaign.controls.buyer.value != '') {
      this.buyerservices.getBuyerNumberByid().subscribe((res: Response) => {
        this.BuyerNumberDropdown = [];

        if (res['statusCode'] == "200") {
            res['buyerNumber'].map(({ _id, status, capping, queue, number, global_cap, buyer_id }) => {
            let num = number
            let data1 = this.selectbuyer.find(x => x.buyers_no == num);
            let p = 0
            if (data1) {
              p = data1.priority
            }
            let data = {
              id: number,
              pause_status: status,
              capping: capping,
              queue: queue,
              itemName: number,
              global_cap: global_cap,
              priority: p,
              buyer_number: number,
              buyer_id: buyer_id,
            }
            let index = this.Campaign.controls.buyer.value.findIndex(data => data.id == buyer_id)
            if (index != -1) {
              if (this.selectbuyer.findIndex(x => x.buyers_no == num) != -1) {
                this.selectedItems1.push(data);
               

                this.buyernumberPeority.push(data);;
                //console.log(this.selectedItems)
              }
              this.BuyerNumberDropdown.push(data)
            }

          })
          this.selectedItems = this.selectedItems1;
        }

      })
      //======================Buyer show using Buyer End =======================================//
    }


  }
  // ==============================================================
  // buyer change Fuction Call End
  // ==============================================================


 

ngAfterViewChecked(){
  this.cdRef.detectChanges();
}
 // ==============================================================
  // publisher change Fuction Call 
  // ==============================================================
  somethingChanged2() {
   
    //this.allBuyerDropdownMain=[]
    this.allBuyerDropdown = [];
    
    this.tfnShowpush = [];
    this.tfnShow = []
    this.selectedItems = []
    this.selectedItems1 = []
    //this.buyerdrop=[]
    this.buyernumberPeority = []
    this.buyerdroppush = []
    this.BuyerNumberDropdown = []
    this.Campaign.controls['buyer'].setValue('');
    //this.somethingChanged()

     // ==============================================================
    // Buyer show using Publisher
     // ==============================================================
    if(this.Campaign.controls.publisher.value!=undefined && this.Campaign.controls.publisher.value!=''){
    this.buyerservices.getBuyerByPubId(this.Campaign.controls.publisher.value).subscribe((res: Response) => {
      this.allBuyerDropdownMain = res['buyers']
      .map(({ buyer_id, name }) => {
        let buyer = {
          'id': buyer_id,
          'itemName': name,
        }
        if (this.buyerIdDisplay.findIndex(data => data == buyer.id) !== -1) {
          if (this.buyerdroppush.findIndex(data => data.id == buyer.id) === -1) {
            this.buyerdroppush.push(buyer);
            //this.buyerdrop=this.buyerdroppush;
          }

        }

        return buyer;
      });;
      this.buyerdrop = this.buyerdroppush;
      //this.Campaign.controls['buyer'].setValue(this.buyerdroppush)

       // ==============================================================
      // Buyer number show using  Buyer
       // ==============================================================

      this.buyerservices.getBuyerNumberByid().subscribe((res: Response) => {
        this.BuyerNumberDropdown = [];

        // console.log(this.selectbuyer)
        res['buyerNumber']
          .map(({ _id, status, capping, queue, number, global_cap, buyer_id }) => {
            let num = number
            let data1 = this.selectbuyer.find(x => x.buyers_no == num);
            let p = 0
            if (data1) {
              p = data1.priority
            }
            let data = {
              id: number,
              pause_status: status,
              capping: capping,
              queue: queue,
              itemName: number,
              global_cap: global_cap,
              priority: p,
              buyer_number: number,
              buyer_id: buyer_id,
            }
            let index = this.buyerdrop.findIndex(data => data.id == buyer_id)
            if (index != -1) {
              if (this.selectbuyer.findIndex(x => x.buyers_no == num) != -1) {
                if(this.selectedItems1.findIndex(data=>data.id==num)==-1){
                this.selectedItems1.push(data);
                

                this.buyernumberPeority.push(data);
                }
              }
              this.BuyerNumberDropdown.push(data)
            }
          })
          this.selectedItems = this.selectedItems1;
      })

       // ==============================================================
      //Buyer number show using Buyer End
       // ==============================================================
    })

     // ==============================================================
    // tfn show using Edit Campaign
     // ==============================================================

    this.services.getTfnByID(this.Campaign.controls.publisher.value).subscribe((res: Response) => {
      this.itemList = [];
       res['tfn']
        .map(({tfn,status})=>{
          let data = {
            'id': tfn,
            'itemName': tfn,
            'status':status
          }
         
          let tfncheck = this.starttfn.findIndex(x => x == tfn);
          if (tfncheck != -1) {
            
            if (this.tfnShowpush.findIndex(x => x.id == data.id) == -1) {
              this.tfnShowpush.push(data);
              
            }
          }
          if(status=="available" || tfncheck != -1){
            
            this.itemList.push(data)
           }
        })
        this.tfnShow = this.tfnShowpush;
        //console.log(this.itemList);

    })
    
    
     // ==============================================================
    // tfn show using Edit Campaign End 
     // ==============================================================
    }
  }
   // ==============================================================
  // publisher change Fuction Call End
   // ==============================================================

   // ==============================================================
  // All Camapign Data show 
   // ==============================================================
  editCampaign() {
    this.selectbuyer = []
    //this.Campaign.controls.publisher.setValue(this.data[0].pub_id)
    //this.buyerdrop=[]
    this.services.getCampaignById(this.campaign_id).subscribe((res: Response) => {

      this.data = res['campaigns'];

      if (this.data[0].inside_route == '') {
        this.buyerNumberboolean = true
        this.queueboolean = false
      } else {
        this.queueboolean = true;
        this.buyerNumberboolean = false;
      }

       // ==============================================================
      // Buyer show using Edit Campaign
       // ==============================================================


      this.buyerIdDisplay = [...new Set(this.data[0].buyer_id)]
      // console.log(this.buyerIdDisplay)
      this.buyerservices.getBuyerByPubId(this.data[0].pub_id).subscribe((response: Response) => {
         this.allBuyerDropdownMain=response['buyers']
          .map(({ buyer_id, name }) => {
            let buyer = {
              'id': buyer_id,
              'itemName': name,
            }
            if (this.buyerIdDisplay.findIndex(data => data == buyer.id) != -1) {
              if (this.buyerdroppush.findIndex(data => data.id == buyer.id) == -1) {
                this.buyerdroppush.push(buyer);
                
              }
            }
           
            return buyer;
          });
          this.buyerdrop = this.buyerdroppush

      })


       // ==============================================================
      // Buyer show using Edit Campaign
       // ==============================================================




       // ==============================================================
      // Tfn show using Edit Campaign
       // ==============================================================
      this.services.getTfnByID(this.data[0].pub_id).subscribe((restfn: Response) => {
       // console.log(restfn['tfn'],status);
        this.itemList = []
        this.starttfn = this.data[0].tfn;
     
        restfn['tfn']
        .map(({tfn,status})=>{
          let data = {
            'id': tfn,
            'itemName': tfn,
          }
          let tfncheck = this.starttfn.findIndex(x => x == tfn);
          if (tfncheck != -1) {
            
            if (this.tfnShowpush.findIndex(x => x.id == data.id) == -1) {
              this.tfnShowpush.push(data);
              
            }
          }
          if(status=="available" || tfncheck != -1){
           // console.log(typeof(status))
           this.itemList.push(data)
          }
          
        })
        this.tfnShow = this.tfnShowpush;

        

        //console.log(this.itemList);
      })
       // ==============================================================
        // Tfn show using Edit Campaign End 
         // ==============================================================

         // ==============================================================
        // Buyer Number show using Edit Campaign  
       // ==============================================================

        this.selectbuyer = this.data[0].buyer_no;
        this.buyerservices.getBuyerNumberByid().subscribe((res: Response) => {
          this.BuyerNumberDropdown = [];

          //console.log(this.selectbuyer)
          res['buyerNumber']
            .map(({ _id, status, capping, queue, number, global_cap, buyer_id }) => {
              let num = number
              let data1 = this.selectbuyer.find(x => x.buyers_no == num);
              let p = 0
              if (data1) {
                p = data1.priority
              }
              let data = {
                id: number,
                pause_status: status,
                capping: capping,
                queue: queue,
                itemName: number,
                global_cap: global_cap,
                priority: p,
                buyer_number: number,
                buyer_id: buyer_id,
              }
              let index = this.buyerIdDisplay.findIndex(data => data == buyer_id)
              if (index != -1) {
                if (this.selectbuyer.findIndex(x => x.buyers_no == num) != -1) {
                  if(this.selectedItems1.findIndex(data=>data.id==num)==-1){
                    this.selectedItems1.push(data);
                 

                  this.buyernumberPeority.push(data);
                  }
                  
                }
                //console.log(data)
                this.BuyerNumberDropdown.push(data)
              }
            })
            this.selectedItems = this.selectedItems1;
           // console.log( this.selectedItems);
        })
         // ==============================================================
        // Buyer Number show using Edit Campaign 
         // ============================================================== 

        this.editForm()

    });
   
  }
   // ==============================================================
  // All Camapign Data show End
   // ==============================================================  

 // ==============================================================
  // All Camapign Data show Form  
   // ==============================================================
  editForm() {
    let route = ''
    let valid: any

    if (this.data[0].inside_route == '') {
      route = '1'
      valid = Validators.required
    } else {
      route = '0'
      valid = ''
    }

    this.Campaign = this.formBuilder.group({
      campname: [this.data[0].camp_name, Validators.required],
      title: [this.data[0].camp_name, Validators.required],
      buffer_time: [this.data[0].buffer_time, Validators.required],
      price_per_call: [this.data[0].price_per_call, Validators.required],
      zone: [this.data[0].time_zone, Validators.required],
      route: [route, Validators.required],
      buyerNumber: [''],
      buyer: [[], valid],
      Tfn: [[], Validators.required],
      queue: [this.data[0].inside_route],
      // read_only: ['', Validators.required],
      id: [this.data[0].campaign_id],
      // p: [],
      queue_name: [this.data[0].queue_name],
      publisher: [this.data[0].pub_id],
      queue_number: [this.data[0].queue_no]
    });
    this.getAllBuyer()
  }
   // ==============================================================
  // All Camapign Data show Form 
   // ==============================================================

    // ==============================================================
  // Submit Campaign data
   // ==============================================================
  onSubmit() {

    this.submitted = true;
    if (this.Campaign.invalid) {
      return;
    }
    let data = JSON.parse(localStorage.getItem('username'))
    let id = '';
    if (data.role == "admin") {
      id = this.Campaign.controls.publisher.value
    } else {
      id = data.uid
    }
    let submitCampign = {};
    if (this.Campaign.controls.queue.value != '' && this.Campaign.controls.queue.value != null) {

      submitCampign = {
        'pub_id': id,
        'camp_name': this.Campaign.controls.title.value,
        'buffer_time': this.Campaign.controls.buffer_time.value,
        'buyer_id': 0,
        'price_per_call': this.Campaign.controls.price_per_call.value,
        'time_zone': this.Campaign.controls.zone.value,
        'read_only': 1,
        'inside_route': this.Campaign.controls.queue.value,
        'tfns': this.Campaign.controls.Tfn.value.map(({ id }) => id),
      }

    } else {
      // console.log(this.Campaign.controls.buyerNumber.value)
      if (this.buyernumberPeority == '') {
        alert('please select Buyer Number');
        return;
      }
      submitCampign = {
        'pub_id': id,
        'camp_name': this.Campaign.controls.title.value,
        'buffer_time': this.Campaign.controls.buffer_time.value,
        'buyer_id': this.Campaign.controls.buyer.value.map(({ id }) => id),
        'price_per_call': this.Campaign.controls.price_per_call.value,
        'time_zone': this.Campaign.controls.zone.value,
        'read_only': 1,
        'inside_route': '',
        'tfns': this.Campaign.controls.Tfn.value.map(({ id }) => id),
        'buyer_numbers': this.buyernumberPeority,
      }
    }

    this.services.postUpdateCampaign(this.Campaign.controls.id.value, submitCampign).subscribe((res: Response) => {

      this.messagestatus = res['status']

      if (this.messagestatus = "success") {
        // this.add = !this.add;
        this.toastr.success('Edit Campaign', 'Campaign Edited Successfully')
        //this.updateTfn(this.Campaign.controls.Tfn.value.map(({ id }) => id), this.Campaign.controls.queue_number.value)
        //this.allcampaign();
        this.compare(this.starttfn, this.Campaign.controls.Tfn.value)

        if ((res['inside_route'] == '') || (res['inside_route'])) {
          let addno = {
            'queue_no': res['queue_no'],
            //'buyer_no': this.buyernumberPeority.map(({ buyer_number }) => buyer_number).join(","),
            'buyer_no': this.buyernumberPeority.map((res)=>{return "Local/"+res.buyer_number+"@from-queue/n,"+res.priority}),
            "token": "ymzfMNQVp3yateWs",
            'tfn': this.Campaign.controls.Tfn.value.map(({ id }) => id).join(',')

          }
          this.services.postFreepbxCommonUpdate(addno).subscribe((result: any) => {

            if (result['statusCode'] == "200") {
              this.services.getQueueRelod().subscribe((resdat: Response) => {})
              this.routepart.navigate(['/dashboard/campaign/manage'])
            }else{
              this.toastr.error('Error','Queue not updated somthing went wrong')
            }

          })


        } else {

          /*let addno = {
            'queue_no': res['queue_no'],
            'buyer_no': '',
            "token": "ymzfMNQVp3yateWs",
            'tfn': this.Campaign.controls.Tfn.value.map(({ id }) => id).join(',')
          }

          this.services.postFreepbxCommonUpdate(addno).subscribe((result: any) => {
            this.services.getQueueRelod().subscribe((resdat: Response) => {
            })
            this.routepart.navigate(['/dashboard/campaign/manage'])
          })*/
          this.routepart.navigate(['/dashboard/campaign/manage']);
        }


        setTimeout(() => {
          this.messageheader = "";
        }, 5000);

      } else {
        this.messageheader = "";
        this.messageheadererror = res['message'];
        setTimeout(() => {
          this.messageheadererror = "";
        }, 5000);
      }

    })
  }
   // ==============================================================
  // Submit Campaign data End
   // ==============================================================
 
   // ==============================================================
  // compare Tfn 
   // ==============================================================
  compare(start, end) {

    let data
    for (var i of start) {

      data = end.find(data => data.id == i);
      // console.log(data);
      if (data == null || data == '') {

        this.unAssignTfnNum.push(i)
      }
    }
    if (this.unAssignTfnNum.join(',') != '') {
      this.tfnservice.getUnsignTfn(this.unAssignTfnNum.join(',')).subscribe((res: Response) => {
       // console.log(res);
      })
      let tfnsend = {
        'tfn': this.unAssignTfnNum,
        'status': 'available',
      }
      //  this.tfnservice.postTfnStatus(tfnsend).subscribe((res: Response) => {
      //   //console.log()
      // })
    }
  }
   // ==============================================================
  // compare Tfn 
   // ==============================================================
  offer() {
    this.backgroundColor = 'black'
  }
  Summary() {
    this.backgroundColor = 'black'
  }
  home() {
    this.backgroundColor = '2px solid #eeeeee'
  }
  onItemSelect(item: any) {

  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
    //console.log(items.target.value);
  }
  onDeSelectAll(items: any) {
    //console.log(items);
  }
  onBuyerSelect(item: any) {
    //console.log(item.target.value);
    let value = item.target.value.split('-');
    var checknumber = []
    checknumber = this.selectedItems.find(x => x.itemName == value[0]);
    // console.log(this.selectedItems);
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
  get campaign() {
    return this.Campaign.controls;
  }
  OnBuyerDeSelect(item: any) {
   //console.log(item)
    let index: number = this.buyernumberPeority.findIndex(data1 => data1.buyer_number == item.buyer_number);
    if (index !== -1) {
      this.buyernumberPeority.splice(index, 1);

    }
    //console.log(item);
  }
  onBuyerDeSelectAll(items: any) {

    this.buyernumberPeority = []


  }
  onBuyerSelectAll(items: any) {
  //  console.log(items)
    // let value=items..split('-');
    var checknumber = []
    checknumber = this.selectedItems.find(x => x.itemName == items.buyer_number);
    // console.log(this.selectedItems);
    if (checknumber) {

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
    }
    //   alert("Please Check First Buyer Number");

    // }
  }
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
  //  Pulisher  Add 
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
  getAllRole() {
    this.roleservice.getRole().subscribe((res: Response) => {
      this.allRole = res['buyer'];
    })
  }
  openModal(id: string) {
    this.publisherModel.open(id);
  }
  closeModal(id: string) {
    this.publisherModel.close(id);
  }
  get errorPublisher() { return this.ManagePublisher.controls; }
  onSubmitPublisher() {
    this.submittedPublisher = true;
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
   let CheckPublisher= this.publisher.find(data=>data.email==this.ManagePublisher.controls.email.value)
    if(CheckPublisher){
      this.toastr.error('Error',"Email Already Exits")
      return;
    }
    // console.log(this.publisher);
    // return;
    this.publiserserive.postManagePublisher(publisher).subscribe((res: Response) => {
      //console.log(res);
      if (res['statusCode'] == "200") {
        this.toastr.success('Add Publisher', 'Publisher  SucessFully added')
        this.allPulisherShow();
        this.closeModal('publisher');
        this.ManagePublisher.reset();
        this.submittedPublisher = false;
      } else {
        this.toastr.error('Error', res['message'])
      }
    })

  }
  allPulisherShow() {
    this.publiserserive.getManagePublisher().subscribe((res: Response) => {
      // console.log(res);
      this.publisher = res['user'];
      for (var publisher of this.publisher) {
        if (publisher.role == 'publisher') {
          let data = {
            'publisher_name': publisher.fullname,
            'pub_id': publisher.uid,
            'role': publisher.role,
          }
          let data1 = {
            'id': publisher.uid,
            'text': publisher.fullname,
            'email':publisher.email
          }
          this.pub.push(data1)
         
          this.dropdownpublisher.push(data);
        }
        this.publisher=this.pub;
      }


    })
  }
  // ==============================================================
  //  End Pulisher  Add 
  // ==============================================================

  // ==============================================================
  // Buyer  Add 
  // ==============================================================
  addBuyer() {
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
  get buyer() { return this.ManageBuyers.controls; }
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
    this.buyerservices.postBuyersPublisher(submit).subscribe((res: Response) => {
      if (res['statusCode'] == "200") {
        this.toastr.success('Add Buyer', 'Buyer SucessFully added')
        this.getAllBuyer();
        this.closeModal('Buyer')
        this.ManageBuyers.reset();
        this.submittedBuyer = false;
      } else {
        this.toastr.error('Error', res['message'])
      }


    });

  }
  getAllBuyer() {
    this.buyerservices.getBuyerByPubId(this.Campaign.controls.publisher.value).subscribe((res: Response) => {
      this.allBuyerDropdown = res['buyers']
      // if(this.allBuyerDropdown==''){
      //   this.allBuyerDropdown='no data';
      //}
    })
  }
   // ==============================================================
  // End Buyer  Add 
   // ==============================================================

 // ==============================================================
  //  Buyer Number  Add 
   // ==============================================================
  addBuyerNumber() {
    this.ManageBuyersNumber = this.formBuilder.group({
      number: ['', Validators.required],
      capping: ['', Validators.required],
      buyer_id: ['', Validators.required],
    })
  }
  get buyernumbervalid() { return this.ManageBuyersNumber.controls }
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
    this.buyerservices.postBuyernumber(submit).subscribe((res: Response) => {
      if (res['statusCode'] == "200") {
        this.toastr.success('Add Buyer', 'Buyer Number SucessFully added')
        this.somethingChanged();
        this.closeModal('BuyerNumber');
        this.ManageBuyersNumber.reset();
        this.submittedBuyerNumber = false;
      } else {
        this.toastr.error('Error', res['message'])
      }

    })
  }
   // ==============================================================
  // End Buyer Number  Add 
   // ==============================================================

    // ==============================================================
  //  Tfn  Add 
   // ==============================================================
  addTfn() {
    this.TfnNumber = this.formBuilder.group({
      tfn_number: ['', Validators.required],
      price_per_tfn: ['', Validators.required],


    });
  }
  get gettfn() { return this.TfnNumber.controls };
  onSubmitTfn() {
    this.submittedTfn = true
    if (this.TfnNumber.invalid) {
      return;
    }
    if (this.alluser.role == 'publisher') {
      this.pubdrop = this.alluser.uid;
    } else {
      this.pubdrop = this.Campaign.controls.publisher.value;
    }
    let tfnsubmit = {
      'tfn': [this.TfnNumber.controls.tfn_number.value],
      "price_per_tfn": this.TfnNumber.controls.price_per_tfn.value,
      "status": "available",
      "pub_id": this.pubdrop,
      "purchase_date": new Date(),
    }
    this.tfnservice.getTFN(tfnsubmit).subscribe((res: Response) => {
      if (res['statusCode'] == "200") {
        this.toastr.success('Add Tfn', 'Tfn  SucessFully added ')
        this.TfnNumber.reset();


        this.closeModal('TfnNumber')
        this.submittedTfn = false
        //console.log(this.Campaign.controls.publisher.value);
        this.services.getTfnByID(this.Campaign.controls.publisher.value).subscribe((res: Response) => {
          //console.log(res);
          this.itemList = []
          this.tfnShow = [];
          this.tfnShowpush = [];

          this.closeModal('TfnNumber');

          res['tfn']
          .map(({tfn,status})=>{
            let data = {
              'id': tfn,
              'itemName': tfn,
            }
            let tfncheck = this.starttfn.findIndex(x => x == tfn);
            if (tfncheck != -1) {
              
              if (this.tfnShowpush.findIndex(x => x.id == data.id) == -1) {
                this.tfnShowpush.push(data);
                
              }
            }
            if(status=="available"  || tfncheck != -1){
             // console.log(status)
              this.itemList.push(data)
             }
          })
          this.tfnShow = this.tfnShowpush;


        })

        this.tfnservice.getTfnFreepbxAdd(this.TfnNumber.controls.tfn_number.value).subscribe((res: Response) => {
          // console.log(res);
        })
      } else {
        this.toastr.error('Error', res['message'])
      }
    });



  }


}

