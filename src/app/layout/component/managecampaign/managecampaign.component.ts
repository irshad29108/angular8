import { Component, OnInit } from '@angular/core';
import { CampaignService } from 'src/app/servies/campaign/campaign.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ManageBuyersService } from 'src/app/servies/user/manage-buyers.service';
import * as moment from 'moment';
import { TfnService } from 'src/app/servies/user/tfn.service';
import { ManagePublisherService } from 'src/app/servies/user/manage-publisher.service';
import { Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { PublisherModalService } from 'src/app/servies/modal/publisher-modal.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-managecampaign',
  templateUrl: './managecampaign.component.html',
  styleUrls: ['./managecampaign.component.css']
})
export class ManagecampaignComponent implements OnInit {
  public popoverTitle: string = 'Title';
  public popoverMessage: string = 'Are you really sure you want to do this?';
  public popoverClass: string = 'custompop';
  submitted = false;
  data: any = []
  message: any;
  Campaign: FormGroup;
  play: FormGroup;
  itemList = [];
  selectedItems12 = new FormControl('');
  selectedItems1 = [];
  select: any;
  alwaysShowCalendars: boolean;
  selectedItems = [];
  settings = {};
  allBuyerDropdown: any;
  allpulisherdrop: any
  public allpulisher: Array<Select2OptionData>;
  publisherdropdown: any = "Select Publisher"
  show = false;
  queue = true;
  BuyerNumberDropdown: any = [];
  buyerDropdownSettings: {};
  validateQueue: any;
  buyernum: any;
  editCampaignData: any = [];
  name: any;
  buffer_time: any;
  Timezone: any;
  queue_name: any;
  queue_number: any;
  messageheader: any;
  messageheadererror: any;
  messagestatus: any;
  selecteddata: any = [];
  selecteddata1: any = []
  buyernumberPeority: any = [];
  buyerdata: any = '';
  buyer_id: any;
  loadingbuyer = false;
  loadingtfn = false;
  loadingbuyernumber = false;

  constructor(public services: CampaignService, public formBuilder: FormBuilder, public buyerservice: ManageBuyersService, public tfnservice: TfnService, public publiserserive: ManagePublisherService, public router: Router, public publisherModel: PublisherModalService, private toastr: ToastrService) {
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
  publisher: any;
  dropdownpublisher = [];
  datashow: any
  ngOnInit() {
    this.playPouseTfn();
    this.datashow = JSON.parse(localStorage.getItem('username'));

    //get all Publisher
    if (this.datashow.role == 'admin') {

      this.allPulisherShow();
    }
    this.allcampaign();
    // this.Form();
  }

  //when Select Publisher  get Buyer on this publisher


  selected: number = 0;
  selectOption(id: number) {
  }

  //all campaign details
  allcamp: any;
  camp: any;
  showmethod = ""
  allcampaign() {
    this.data = [];
    this.showmethod = "loading"
    if (this.datashow.role == 'admin') {
      this.services.getallcampaign().subscribe((res: Response) => {

        this.data = res['campaigns'].reverse();
        if (this.data == '') {
          this.showmethod = "no data";
        } else {
          this.showmethod = "";
        }

      })
    } else {
      this.services.getallcampaign().subscribe((res: Response) => {

        this.camp = res['campaigns'];
        //console.log(this.datashow);
        for (var i of this.camp) {
          if (i.pub_id == this.datashow.uid) {
            let data = {
              'camp_name': i.camp_name,
              'publisherName': i.publisherName,
              'buffer_time': i.buffer_time,
              'price_per_call': i.price_per_call,
              'inside_route': i.inside_route,
              'time_zone': i.time_zone,
              'queue_name': i.queue_name,
              'queue_no': i.queue_no,
              'created_at': i.created_at,
              'campaign_id': i.campaign_id,
              'status': i.status,
              'read_only': i.read_only,
              '_id': i._id,


            }
            this.data.push(data);
          }

        }
        this.data.reverse();
        if (this.data == '') {
          this.showmethod = "no data";
        } else {
          this.showmethod = "";
        }
      });
    }

  }
  status: boolean = false;
  clickEvent() {
    this.status = !this.status;
  }
  add: boolean = false;
  button: any;
  //hide and show campaign UI

  deletebuyerfreepbx: any;

  delete(id, route, queue_no) {

    this.services.getCampaignById(id).subscribe((restfn1: Response) => {

      this.services.deleteCampaign(id).subscribe((res: Response) => {
        this.messagestatus = res['status']
        if (this.messagestatus = "success") {
          if (route == '' || route == undefined) {
            let Queue = {
              'queue_no': queue_no
            }

            let buyer = {
              'queue_no': queue_no,
              'buyer_no': restfn1['campaigns'][0]['buyer_no'].map(({ buyers_no }) => buyers_no).join(','),
              'tfn': restfn1['campaigns'][0]['tfn'].join(','),
              "token": "ymzfMNQVp3yateWs",
            }

            this.services.postDeletefreepbxcommon(buyer).subscribe((common: any) => {

              if (common['statusCode'] == "200") {
                this.toastr.success('Campaign deletion', 'Campaign Successfully Deleted')
              }else{
                this.toastr.error('Error','Queue not updated somthing went wrong')
              }

              this.services.getQueueRelod().subscribe((resdat: Response) => {})

            })

          } else {
            this.tfnservice.getUnsignTfn(restfn1['campaigns'][0]['tfn'].join(',')).subscribe((res: Response) => {
              // console.log(res);
              this.services.getQueueRelod().subscribe((resdat: Response) => {})
            })

            this.toastr.success('Campaign deletion', 'Campaign Successfully Deleted')

          }

          this.allcampaign();
          setTimeout(() => {
            this.messageheader = "";
          }, 5000);

        } else {
          this.messageheader = "";
          this.toastr.success('Campaign Error', res['message'])
          //this.messageheadererror = res['message'];
          setTimeout(() => {
            this.messageheadererror = "";
          }, 5000);
        }
      })
    });
  }



  playPouseTfn() {
    this.play = this.formBuilder.group({
      TFN: ['', Validators.required],
      queue_no: ['', Validators.required],

    });
  }

  //Submit of Campaign details

  //Preefix tfn update
  updateTfn(tfn, queue) {
    
    let tfnsend = {
      'tfn': [tfn],
      'status': 'used',
    }
    this.tfnservice.postTfnStatus(tfnsend).subscribe((res: Response) => {
      //console.log()
    })
    this.services.getTfnFreepbxUpdate(tfn, queue).subscribe((res: Response) => {
      // console.log(res);
    })

  }


  //when Select Buyer then show Buyer Number Related to buyer

  createRange(number) {
    var items: number[] = [];
    for (var i = 0; i <= number; i++) {
      items.push(i);
    }
    return items;
  }


  //Edit Campaign Details
  selectbuyer: any;


  // =========================== filter Details==============================================
  loader: boolean = false;
  applyFilter() {
    this.loader = true;
    this.clickEvent()
    setTimeout(() => {
      this.loader = false;
    }, 500);
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
        // console.log(statIndx);
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
    // if (num == this.filtr2) {
    //   this.buffer_time = "";
    // }
    if (num == 'filtr3') {
      this.Timezone = "";
    }
    if (num == 'filtr4') {
      this.queue_name = "";
    }
    if (num == 'filtr5') {
      this.queue_number = "";
    }

  }
  resetfilter() {
    this.name = "";
    this.Timezone = "";
    this.queue_name = "";
    this.queue_number = "";
  }
  // =========================== End of filter Details==============================================
  showEdit(id) {
    this.router.navigate(['/dashboard/campaigns/manage' + id])
  }
  allPulisherShow() {
    this.publiserserive.getManagePublisher().subscribe((publisher: any) => {
      this.allpulisherdrop = publisher['user']
        .filter(applicable => 'admin' != applicable.role)
        .map(({ fullname, uid }) => {

          let publisherdrop = {
            'id': uid,
            'text': fullname,
          };
          return publisherdrop;
        });
      this.allpulisher = this.allpulisherdrop
    })
  }
  resetpublisher() {
    this.publisherdropdown = "Select Publisher"
  }
  clickFilter() {
    // alert();
    this.status = !this.status;
  }
  tfnplay: any;
  submitted1 = false;
  openModal(id: string, campaign_id) {
    this.itemList = [];
    this.services.getCampaignById(campaign_id).subscribe((tfn: any) => {
      this.tfnplay = tfn['campaigns']
        .map(({ tfn, queue_no }) => {
          let playtfn = {
            tfn: tfn,
            queue_no: queue_no,
          };
          // console.log('Tax rate: ', taxRate);
          return playtfn;
        });
      //  console.log(this.tfnplay)
      for (var i of this.tfnplay[0].tfn) {
        let data = {
          'id': i,
          'itemName': i
        }
        this.itemList.push(data);
      }
      this.play = this.formBuilder.group({
        TFN: ['', Validators.required],
        queue_no: [this.tfnplay[0].queue_no, Validators.required],

      });
    })
    this.publisherModel.open(id);
  }
  closeModal(id: string) {
    this.publisherModel.close(id);
  }
  get Play() {
    return this.play.controls;
  }


  submittedLoader = false;

  playtfn() {

    this.submitted1 = true;
    if (this.play.invalid) {

      return
    }

    this.submittedLoader = true;

    let data = { "tfn": this.play.controls.TFN.value.map(({ id }) => id).join(','), "queue_no": this.play.controls.queue_no.value }
    this.services.postAddFreepbxPlayCampaign(data).subscribe((res: any) => {
      
      this.services.getQueueRelod().subscribe((resdat: Response) => {
        console.log('getQueueReloded');
      })
      this.toastr.success('Status', 'Compaign TFN SucessFully Played');
      this.submittedLoader = false;
      
    })
  }
  pause() {

    this.submitted1 = true;
    if (this.play.invalid) {
      return
    }
    
    this.submittedLoader = true;

    let data = { "tfn": this.play.controls.TFN.value.map(({ id }) => id).join(','), "queue_no": this.play.controls.queue_no.value }
    this.services.postAddFreepbxPauseCampaign(data).subscribe((res: any) => {
      this.services.getQueueRelod().subscribe((resdat: Response) => {
        console.log('getQueueReloded');
      })
      this.toastr.success('Status', 'Compaign TFN SucessFully Paused')
      this.submittedLoader = false;
    })
  }

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
  resetcal(){
  this.select="";
  }

}
