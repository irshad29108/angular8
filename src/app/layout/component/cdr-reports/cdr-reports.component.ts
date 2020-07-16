import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import * as moment from 'moment';
import { CdrService } from 'src/app/servies/cdr/cdr.service';
import { ManagePublisherService } from 'src/app/servies/user/manage-publisher.service';
import { CampaignService } from 'src/app/servies/campaign/campaign.service';
import Plyr from 'plyr';
import { PlyrComponent } from 'ngx-plyr';
import { FormControl } from '@angular/forms';
import { ManageBuyersService } from 'src/app/servies/user/manage-buyers.service';
import { DatePipe } from '@angular/common'
import { Select2OptionData } from 'ng-select2';
import { ExcelService } from 'src/app/servies/excel.service';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { map, filter } from 'rxjs/operators';
import { DashboardService } from 'src/app/servies/user/dashboard/dashboard.service';
import { Color, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { PublisherModalService } from 'src/app/servies/modal/publisher-modal.service';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-cdr-reports',
  templateUrl: './cdr-reports.component.html',
  styleUrls: ['./cdr-reports.component.css']
})
export class CdrReportsComponent implements OnInit {

  cid_block;
  tfn_block
  totalCallsLoader: boolean = true;
  totalUniqCallsLoader: boolean = true;
  totalAvgCallsLoader: boolean = true;
  totalUniqAnsweredCallsLoader: boolean = true;
  color = '#ffc36d';
  apiEndPont: any = '';
  buyernumberFilter: any;
  buyer_name: any;
  totalUniqueAnsCallsCount: any;
  totalUniqueAnsCallsCountDump: any;
  showBuyerNumberDuplicate = true
  destination: any
  disposition: any
  public data: any;
  selectedFilter: string = '';
  filtr1: boolean = true;
  filtr2: boolean = true;
  filtr3: boolean = true;
  filtr4: boolean = true;
  filtr5: boolean = true;
  filtr6: boolean = true;
  filtr7: boolean = true;
  filtr8: boolean = true;
  did: any
  showpub: any=false;
  duplicate: any = []
  duplicatevalue: any = []
  duplicatevaluedump: any = []
  cid: any
  hangby: any;
  publisherdropdown: any = "Select Publisher";
  buyerdropdown: any = '';
  statusSearch: any
  alwaysShowCalendars: boolean;
  palyer: boolean = false
  totalcalls: any;
  totalcallsdump: any;
  totalHandlingTime: number = 0;
  totalUniqueAnsCalls: any;
  totalUniqueCalls: any;
  pub: any = [];
  duplicateCount: any = 0;
  duplicateCountDump: any = 0;
  campaign: any = [];
  public buyersData: Array<Select2OptionData>;
  public publisher: Array<Select2OptionData>;
  public exampleData: Array<Select2OptionData>;
  campaigndropdown: any = "Select Campaign";
  alluser: any;
  playurlname: any;
  buyer: any;
  url: any=''
  camp: any;
  showmethod1: any = 'loading';
  datadump: any = [];
  buyernum: any;
  buyerNumbers:any=[];
  namedatils:any
  status: boolean = false;
  qualifiedCalls:number=0;
  buyerEarning:number=0;
  buyerSpending:number=0;
  qualifiedBuyers:boolean=false;
  qualifiedCallsBuyerArray:any=[];
  publisher_id:any;
  setting: boolean = false;
  totalCallArray=[];
  totalUniqAnsCallArray=[];
  totalCallArrayDump=[];
  totalCallBoolean=true;
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Your Cdr Report :',
    useBom: true,
    noDownload: false,
    headers: ["Publisher Name", "Campaign Name", "Did", "Cid", "Buyer Number", "Date", "callEnd", "Destination", "Disposition", "Duration", "Recordingfile", "Status"]
  };
  ranges: any = {

    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
  }
  selected: any = { start: moment(), end: moment() }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  activeStatusTotal: boolean = false;
  activeStatusUnique: boolean = false;
  activeStatusUniqueAns: boolean = false;





  constructor(public dservice: DashboardService, public sideNavService: ServiceService, public service: CdrService, public publisherservice: ManagePublisherService, public campservice: CampaignService, public buyerservice: ManageBuyersService, public datepipe: DatePipe, private excelService: ExcelService, public publisherModel: PublisherModalService, private toastr: ToastrService,private route:Router,private route1: ActivatedRoute) {
    this.alwaysShowCalendars = true;
    this.sideNavService.currentNameSubject.subscribe(val => {
      this.playurlname = val;
    })
  }

  async ngOnInit() {
    
    const helper = new JwtHelperService();
    // this.alluser = helper.decodeToken(localStorage.getItem('token'));
    // const expirationDate = helper.getTokenExpirationDate(localStorage.getItem('token'));
    // const isExpired = helper.isTokenExpired(localStorage.getItem('token'));
    // console.log(decodedToken);
    this.alluser = JSON.parse(localStorage.getItem('username'));

    if(!this.alluser){
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      this.route.navigate(['login']);
    }
    if (this.alluser.role == 'publisher') {
      this.url = '?pub_id=' + this.alluser.uid
    }
    var id = this.route1.snapshot.paramMap.get('id');
    if(id!=null){
     // console.log(id.indexOf("&"))
      if(id.indexOf("&")!=-1 && id.indexOf("@")!=-1){
        var camp = id.split("&");
      this.namedatils =id.split("@");
      var name=this.namedatils[1].split("&")
    if(name[0]=='publish'){
      this.publisherdropdown = camp[1];
    }else if(name[0]=='camp'){
      
      this.campaigndropdown = camp[1];
    }else{
     // console.log("sdafs")
    }
      }else{
        this.route.navigate(['/404'])
      }
      
    }
    if(this.alluser.role == 'publisher'){
      this.publisher_id=this.publisherdropdown
    }else if(this.alluser.role == 'monitor'){
      this.publisher_id=-1;
    }else{
      this.publisher_id="";
    }


//+++++++++++++++++++++++++++++++++all Campaign DropDown++++++++++++++++++++++++++++++++++//
    this.campservice.getallcampaign().subscribe((res: Response) => {
      this.camp = res['campaigns'];
     
      if (this.alluser.role == 'publisher') {
        for (var i of this.camp) {
          if (i.pub_id == this.alluser.uid) {
            let data = {
              'id': i.campaign_id,
              'text': i.camp_name,

            }
            this.campaign.push(data);
          }
          this.exampleData = this.campaign
          if(this.campaigndropdown!="Select Campaign"){
           // console.log(this.campaigndropdown);return;
            if(this.camp.findIndex(data=>data.campaign_id==this.campaigndropdown)==-1){
              this.route.navigate(['/404']);
            }
          }
        }

      } else {
        for (var i of this.camp) {
          let data = {
            'id': i.campaign_id,
            'text': i.camp_name,

          }
          this.campaign.push(data);
        }
        this.exampleData = this.campaign
        if(this.campaigndropdown!="Select Campaign"){
          //console.log(this.campaigndropdown);return;
        if(this.camp.findIndex(data=>data.campaign_id==this.campaigndropdown)==-1){
          this.route.navigate(['/404']);
        }
      }
        
      }



    })

//+++++++++++++++++++++++++++++++++all Campaign DropDown End++++++++++++++++++++++++++++++++++//

//+++++++++++++++++++++++++++++++++all Publisher DropDown ++++++++++++++++++++++++++++++++++//
    if (this.alluser.role == 'publisher' || this.alluser.role == 'buyer') {
      this.showpub = false;
    } else {
      this.publisherservice.getManagePublisher().subscribe((res: Response) => {
        this.showpub = true;
        for (var i of res['user']) {
          if (i.role != 'admin') {
            let data = {
              'id': i.uid,
              'text': i.fullname
            }
            this.pub.push(data)
          }

        }
        this.publisher = this.pub;
        //console.log(this.publisher)
        //console.log(typeof this.publisher)
      })
    }
//+++++++++++++++++++++++++++++++++All Publisher DropDown End ++++++++++++++++++++++++++++++++++//

//+++++++++++++++++++++++++++++++++All Buyer  ++++++++++++++++++++++++++++++++++++++++++++++//
    if (this.alluser.role == "buyer") {
      this.buyerservice.getNumberByid(this.alluser.uid).subscribe((res: any) => {
        this.buyer = res['buyerNumber'];

        this.buyernum = this.buyer.map(({ number }) => number).join(',')
        if (this.alluser.role == 'buyer') {
          this.url = '?buyerNumber=[' + this.buyernum + ']'
        } else if (this.alluser.role == 'admin') {
          if (this.publisherdropdown != 'Select Publisher') {
            this.url = '?pub_id=' + this.publisherdropdown
          }
        }
      })
    }
//+++++++++++++++++++++++++++++++++All Buyer  ++++++++++++++++++++++++++++++++++++++++++++++//

    await this.buyerservice.getBuyerDetails().subscribe((buyer:any)=>{
      this.buyerNumbers = buyer['buyer'].map(function(obj) {
        return { 
          buyer_number:obj['number'], 
          price_per_call: obj['price_per_call'], 
          buffer_time: obj['buffer_time'] , 
          name: obj['name'], 
        }

          
      });
      let NameArray = this.buyerNumbers.map(({name})=>name);
      let buyerNameArray = NameArray.filter((item,index)=>NameArray.indexOf(item)===index);
      this.buyersData = buyerNameArray.map(item=>{return {'id':item,'text':item}});
  
    });
    

  
    this.showcontent();

  }



//+++++++++++++++++++++++++++++++++Cdr Report Api  ++++++++++++++++++++++++++++++++++++++++//
  showcontent() {
    this.duplicate = []
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    this.service.getTotalCalls(start.getTime(), end.getTime(), this.url).subscribe((res: Response) => {
      this.totalCallsLoader = false;
      this.totalUniqCallsLoader = false;
      this.totalUniqAnsweredCallsLoader = false;
      this.totalcalls = res['totalcalls'];
      this.allshowcdr(res['cdr']);
      this.totalcallsdump = res['totalcalls'];
    });
    this.service.getAHT(this.publisher_id,start.getTime(), end.getTime(), this.url,[]).subscribe((res: Response) => {
      this.totalAvgCallsLoader = false;
      if (res['aht']['aht']) {
        this.totalHandlingTime = Math.round((res['aht']['aht']) / 60);
      } else {
        this.totalHandlingTime = 0;
      }
    });


  }
  //+++++++++++++++++++++++++++++++++Cdr Report Api  ++++++++++++++++++++++++++++++++++++++++//

   //+++++++++++++++++++++++++++++++++Cdr Report data Show  +++++++++++++++++++++++++++++++++//
  allshowcdr(res) {
       
    this.showmethod1 = "loading"
    this.data = [];
    this.datadump = [];
    this.duplicatevalue = [];
    this.duplicateCount = 0
    this.totalUniqueAnsCallsCount = 0
    this.totalUniqueAnsCallsCountDump = 0
    var qualifiedCallsArray = [];
    var buyerName ='Unknown';
    var price_per_call =0;
    var buffer_time =0;
 
    for (var i of res) {

      var diff = new Date(i.end).getTime() - new Date(i.start).getTime();
      var days = Math.floor(diff / (60 * 60 * 24 * 1000));
      var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
      var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
      var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
      var extnsn = ''

      if (i.dstchannel != " ") {
        var dstchannel = i.dstchannel.split('@')
        var channel = dstchannel[0].split('/');
        extnsn = channel[1];
      }
      let cidduplicate = 0

      if(extnsn!=''){
        let buyerNameObject = this.buyerNumbers.find(item=>item.buyer_number==extnsn);
        if(typeof buyerNameObject !='undefined'){
          buyerName  = typeof buyerNameObject.name!='undefined'?buyerNameObject.name:buyerName
          price_per_call  = typeof buyerNameObject.price_per_call!='undefined'?parseInt(buyerNameObject.price_per_call):price_per_call
          buffer_time  = typeof buyerNameObject.buffer_time!='undefined'?parseInt(buyerNameObject.buffer_time):buffer_time
        }else{
          buyerName='Unknown';
          price_per_call=0;
          buffer_time=0;
        }
     }else{
        buyerName='Unknown';
        price_per_call=0;
        buffer_time=0;
     }


//+++++++++++++++++++++++++++++++++Duplicate Data Show  +++++++++++++++++++++++++++++++++++//

      if (this.data.findIndex(data => data.cid == i.src) > -1) {
        this.duplicateCount = this.duplicateCount + 1;
        this.duplicateCountDump = this.duplicateCountDump + 1;
        cidduplicate = 1
        let duplicateCdr = {
          'date': i.start,
          'did': i.did,
          'destination': i.dst,
          'cid': i.src,
          'disposition': i.dstchannel != "" ? i.disposition : 'MISSED CALL',
          "callEnd": i.end,
          'duration': hours + ':' + minutes + ':' + seconds,
          'status': i.status,
          'recordingfile': i.recordingfile.replace( /\+/g, "%2B" ), 
          'camp_id': i.camp_id,
          'camp_name': i.camp_name!=0?i.camp_name:'Unknown',
          'pub_id': i.pub_id,
          'publisher_name': i.publisherName,
          'buyer_id': extnsn == undefined ? '' : extnsn,
          'duplicate': cidduplicate,
          'buyer_name': buyerName//typeof i.buyer_name!='undefined'?i.buyer_name:'Unknown'

        }
        this.duplicatevalue.push(duplicateCdr);
        this.duplicatevaluedump.push(duplicateCdr);
      }else{
        //++++++++++++++++++++++Total Unique Call++++++++++++++++++++++++++++++++++++++++
        let duplicateCdr = {
          'date': i.start,
          'did': i.did,
          'destination': i.dst,
          'cid': i.src,
          'disposition': i.dstchannel != "" ? i.disposition : 'MISSED CALL',
          "callEnd": i.end,
          'duration': hours + ':' + minutes + ':' + seconds,
          'status': i.status,
          'recordingfile': i.recordingfile.replace( /\+/g, "%2B" ), 
          'camp_id': i.camp_id,
          'camp_name': i.camp_name!=0?i.camp_name:'Unknown',
          'pub_id': i.pub_id,
          'publisher_name': i.publisherName,
          'buyer_id': extnsn == undefined ? '' : extnsn,
          'duplicate': cidduplicate,
          'buyer_name': buyerName//typeof i.buyer_name!='undefined'?i.buyer_name:'Unknown'

        }
        this.totalCallArray.push(duplicateCdr);
        this.totalCallArrayDump.push(duplicateCdr);

        if (duplicateCdr.disposition == "ANSWERED") {

          this.totalUniqAnsCallArray.push(duplicateCdr);
          this.totalUniqueAnsCallsCount = this.totalUniqueAnsCallsCount + 1;
          this.totalUniqueAnsCallsCountDump = this.totalUniqueAnsCallsCountDump + 1
        }

      }
   
//+++++++++++++++++++++++++++++++++Duplicate Data Show End +++++++++++++++++++++++++++++++++++//

//+++++++++++++++++++++++++++++++++All Data Show  +++++++++++++++++++++++++++++++++++//
      let cdr = {
        'date': i.start,
        'did': i.did,
        'destination': i.dst,
        'cid': i.src,
        'disposition': i.dstchannel != "" ? i.disposition : 'MISSED CALL',
        'duration': i.duration,
        "callEnd": i.end,
        'status': i.status,
        'recordingfile': i.recordingfile.replace( /\+/g, "%2B" ),
        'camp_id': i.camp_id,
        'camp_name': i.camp_name!=0?i.camp_name:'Unknown',
        'pub_id': i.pub_id,
        'publisher_name': i.publisherName,
        'buyer_id': extnsn == undefined ? '' : extnsn,
        'duplicate': cidduplicate,
        'buyer_name': buyerName//typeof i.buyer_name!='undefined'?i.buyer_name:'Unknown'

      }
      //++++++++Total Unique Ans Call++++++++++++++++++++++++++++++++//
      /*if (cdr.disposition == "ANSWERED") {
        this.totalUniqueAnsCallsCount = this.totalUniqueAnsCallsCount + 1;
        this.totalUniqueAnsCallsCountDump = this.totalUniqueAnsCallsCountDump + 1
      }*/
       //++++++++Total Unique Ans Call End ++++++++++++++++++++++++++++++++//
      this.data.push(cdr);
      this.datadump.push(cdr)


       if (qualifiedCallsArray.map(({src}) => src).filter(data=>data==i.src).length <=0) {
            i.buyer_name = buyerName;
            i.buffer_time_buyer = buffer_time;
            i.price_per_call_buyer = price_per_call;
            if (i.disposition == "ANSWERED") {
              if(i.buffer_time_camp<=0){
                qualifiedCallsArray.push(i);
              }else if(i.duration >= i.buffer_time_camp){
                  qualifiedCallsArray.push(i);
              }  
            }
      }
    }

    //console.log(this.data);
    if(qualifiedCallsArray.length){

      this.buyerEarning=qualifiedCallsArray.map(({ price_per_call_buyer }) => price_per_call_buyer==undefined?0:parseFloat(price_per_call_buyer)).reduce((acc,val)=> acc+val);

      this.buyerSpending=qualifiedCallsArray.map(({ price_per_call_camp }) => price_per_call_camp!=undefined?0:parseFloat(price_per_call_camp)).reduce((acc,val)=> acc+val);

      this.qualifiedCalls = qualifiedCallsArray.length;

      let buyersqualifiedList = qualifiedCallsArray.map(({ buyer_id,buyer_name,camp_name,publisherName,price_per_call_camp,price_per_call_buyer}) => {
        return  {buyer_id,buyer_name,camp_name,publisherName,price_per_call_camp,price_per_call_buyer};

      });

      let uniqueBuyerList = [...new Set(buyersqualifiedList.map(({buyer_id})=>buyer_id))];

      this.qualifiedCallsBuyerArray = uniqueBuyerList.map(item=>{

        let newItem = buyersqualifiedList.filter((e,i,a) => {
          if (item == e.buyer_id) {
            return true;
          }
        })

        return {
          'buyer_name':newItem[0].buyer_name,
          'camp_name':newItem[0].camp_name,
          'qualifiedCalls':newItem.length,
          'publisherName':newItem[0].publisherName,
          'buyerEarning':newItem.map(({ price_per_call_buyer }) => price_per_call_buyer==undefined?0:parseFloat(price_per_call_buyer)).reduce((acc,val)=> acc+val),
          'buyerSpending':newItem.map(({ price_per_call_camp }) => price_per_call_camp!=undefined?0:parseFloat(price_per_call_camp)).reduce((acc,val)=> acc+val),
        }

      })

 
      
  }



//+++++++++++++++++++++++++++++++++All Data Show End +++++++++++++++++++++++++++++++++++//

    //++++++++Total Unique Call++++++++++++++++++++++++++++++++//
    this.totalUniqueCalls = this.totalcalls - this.duplicateCount
    //++++++++Total Unique Call End++++++++++++++++++++++++++++++++//

    //++++++++Total Unique Ans Call Calculation++++++++++++++++++++++++++++++++//
    if (this.totalUniqueAnsCallsCount <= 0) {
      this.totalUniqueAnsCalls = this.totalUniqueCalls
    } else {
      this.totalUniqueAnsCalls = this.totalUniqueAnsCallsCount; //(this.totalUniqueAnsCallsCount - this.duplicateCount)
    }
    
    /*if (this.totalUniqueAnsCalls <= 0) {
      this.totalUniqueAnsCalls = this.totalUniqueCalls;
    }*/

     //++++++++Total Unique Ans Call Calculation End++++++++++++++++++++++++++++++++//
    //this.data.reverse();
    //this.datadump.reverse();


    this.filterAllCount();

    if (this.data == '') {
      this.showmethod1 = "no data";
    } else {
      this.showmethod1 = "";
    }

  }
 //+++++++++++++++++++++++++++++++++Cdr Report data Show End  +++++++++++++++++++++++++++++++++//

 
  clickFilter() {
    // alert();
    this.status = !this.status;
  }


  clicksetting() {
    // alert();
    this.setting = !this.setting;
  }

  qualifiedBuyersList(){
    this.qualifiedBuyers = !this.qualifiedBuyers;
  }
  
  //+++++++++++++Publisher Reset+++++++++++//
  resetpublisher() {
    this.publisherdropdown = "Select Publisher";
    this.exampleData=this.campaign;
    this.filterAllCount();
   

  }
  //+++++++++++++Publisher Reset End+++++++++++//

  //++++++++++++ Campaign Change ++//
  changecampaign() {
    this.filterAllCount();
  }
  //++++++++++++ Campaign Change End +++++//

  //++++++++++++Reset All data++++++++++++//
  refreshalldata() {
    this.totalCallsLoader = true;
    this.totalUniqCallsLoader = true;
    this.totalUniqAnsweredCallsLoader = true;
    this.totalAvgCallsLoader = true;
    this.showBuyerNumberDuplicate = true;
    this.data = [];
    this.showmethod1 = "loading"
    this.activeStatusUnique = false; 
    this.activeStatusTotal = false; 
    this.showcontent()

  }
  //++++++++++++Reset All data End++++++++++++//

  //+++++++++++Reset Campaign++++++++++++++//
  resetcampaign() {
    this.campaigndropdown = "Select Campaign";
    this.filterAllCount();
  }
  //+++++++++++Reset Campaign End++++++++++++++//
  //+++++++++++++Publisher Change+++++++++++//
  changepublisher() {
    this.campaignByPublisher();
    this.filterAllCount();

  }

  resetbuyer() {
    this.buyerdropdown ='';
    this.filterAllCount();
  }
  //+++++++++++Reset Campaign End++++++++++++++//
  //+++++++++++++Publisher Change+++++++++++//
  changebuyer() {
    this.filterAllCount();

  }


  //+++++++++++++Publisher Change End+++++++++++//
  campaignByPublisher(){
    this.campservice.getallcampaign().subscribe((res: Response) => {
      this.camp = res['campaigns']
      .filter(data=>data.pub_id==this.publisherdropdown)
      .map(({campaign_id,camp_name})=>{
        let data={
          'id': campaign_id,
          'text': camp_name,
        }
        return data;
      })
      this.exampleData=this.camp
    })
  }
  //+++++++++++++Repeat Value+++++++++++//
  repeatvalue() {
    if (this.showBuyerNumberDuplicate == true) {
      this.data = this.datadump;
      this.filterAllCount();
    }
  }
   //+++++++++++++Repeat Value End+++++++++++//


  closefiltr(num) {
    if (num == 'filtr1') {
      this.did = '';
     
    }
    if (num == 'filtr2') {
      this.disposition = '';
      
    }
    if (num == 'filtr3') {
      this.cid = '';
    
    }
    if (num == 'filtr4') {
      this.hangby = '';
    }
    if (num == 'filtr5') {
      this.buyernumberFilter = '';
    }
    if (num == 'filtr6') {
      this.destination = '';
       this.repeatvalue();
    }

    if (num == 'filtr8') {
      this.buyer_name = '';
    }

    this.repeatvalue();
    //this[num] = false;
  }

  //++++++++++++++++All Reset Filter++//
  resetfilter() {
    this.did = '';
    this.destination = '';
    this.cid = '';
    this.hangby = '';
    this.buyernumberFilter = '';
    this.buyer_name = '';
    this.destination = '';
    this.disposition = '';
    this.repeatvalue();
  }
  //++++++++++++++++ date Filter++++++++++++++++++++++++++++//
  submit() {
    // this.buyerservice.getNumberByid(this.alluser.uid).subscribe((res: Response) => {
    //   this.buyer = res['buyerNumber'];

    //   this.buyernum = this.buyer.map(({ number }) => number).join(',')
    //   if (this.alluser.uid == 'buyer') {
    //     data = '?buyerNumber=[' + this.buyernum + ']'
    //   } else if (this.alluser.role == 'admin') {
    //     if (this.publisherdropdown != 'Select Publisher') {
    //       data = '?pub_id=' + this.publisherdropdown
    //     }
    //   }
      if (this.selected.startDate) {

        this.showmethod1 = "loading";
        this.totalCallsLoader = true;
        this.totalUniqCallsLoader = true;
        this.totalAvgCallsLoader = true;
        this.totalUniqAnsweredCallsLoader = true;  
        let data = '';
        if (this.alluser.role == 'publisher') {
          data = '?pub_id=' + this.alluser.uid
        }

        this.service.getTotalCalls(this.selected.startDate._d.getTime(), this.selected.endDate._d.getTime(), data).subscribe((res: Response) => {
          this.totalUniqCallsLoader = false;
          this.totalUniqAnsweredCallsLoader = false;
          this.totalCallsLoader = false;

          this.totalcalls = res['totalcalls'];
          this.totalcallsdump = res['totalcalls']
          //console.log(this.totalcallsdump)
          this.allshowcdr(res['cdr']);
        })
        this.service.getAHT(this.publisher_id,this.selected.startDate._d.getTime(), this.selected.endDate._d.getTime(), data,[]).subscribe((res: Response) => {
          this.totalAvgCallsLoader = false;
          if (res['aht']['aht']) {
            this.totalHandlingTime = Math.round((res['aht']['aht']) / 60);
          } else {
            this.totalHandlingTime = 0;
          }
        });


      }else{
        this.toastr.warning('Note', 'Change a desirable date first')
      }

  }


  //++++++++++++++++ date Filter End++++++++++++++++++++++++++++//

 //++++++++++++++++++++++Audio Player+++++++++++++++++++++++++++++++++//
  playfor(path, date) {
    let latest_date = this.datepipe.transform(date, 'yyyy/MM/dd');
    let data ='https://recordingsaws1.s3-us-west-1.amazonaws.com/server34/'+ latest_date + '/' + path
    this.sideNavService.currentNameSubject.next(data)
    this.sideNavService.mplay()
  }
  //++++++++++++++++++++++Audio Player End+++++++++++++++++++++++++++++++++//
  // @ViewChild(PlyrComponent, Plyr)
  // plyr: PlyrComponent;
  // player: Plyr;
  // options = {
  //   settings: ['captions', 'quality', 'speed'],
  //   controls: [
  //     'play-large',
  //     'restart',
  //     'rewind',
  //     'play',
  //     'fast-forward',
  //     'progress',
  //     'current-time',
  //     'duration',
  //     'mute',
  //     'volume',
  //     'captions',
  //     'settings',
  //     'pip',
  //     'airplay',
  //     'download',
  //     'fullscreen',
  //   ],

  // };

  // played(event: Plyr.PlyrEvent) {
  //   //console.log('played', event);
  // }

  // play(): void {
  //   this.player.play(); // or this.plyr.player.play()
  // }

  // pause(): void {
  //   this.player.pause(); // or this.plyr.player.play()
  // }

  // stop(): void {
  //   this.player.stop(); // or this.plyr.player.stop()
  // }

  // restart(): void {
  //   this.player.restart();
  // }
  // playercross() {
  //   this.palyer = false;
  // }

  //+++++++++++++++++++++++++ Excel Download++++++++++++++++++++++++++++//
  exportAsXLSX(): void {
    let csv
    if(this.publisherdropdown=='Select Publisher'){
       csv = this.data

      .map(({ date, did, destination, cid, disposition, callEnd, duration, status, recordingfile, camp_name, publisher_name, buyer_id }) => {

        let latest_date = 'https://recordingsaws1.s3-us-west-1.amazonaws.com/server34/' + this.datepipe.transform(date, 'yyyy/MM/dd');

        let csvdata = {
          "Publisher Name": publisher_name == '' ? '----------------' : publisher_name,
          "Camp Name": camp_name == 0 ? '----------------' : camp_name,
          Did: did,
          Cid: cid,
          Buyer_Number: buyer_id == undefined ? '----------------' : buyer_id,
          Date: date,
          CallEnd: callEnd,
          Destination: destination,
          Disposition: disposition,
          Duration: duration,
          Recordingfile: latest_date + '/' + recordingfile,
          Status: status
        };

        return csvdata;
      });
    }else{
      csv = this.data
      .filter(data=>data.pub_id==this.publisherdropdown)
      .map(({ date, did, destination, cid, disposition, callEnd, duration, status, recordingfile, camp_name, publisher_name, buyer_id }) => {

        let latest_date = 'https://recordingsaws1.s3-us-west-1.amazonaws.com/server34/' + this.datepipe.transform(date, 'yyyy/MM/dd');

        let csvdata = {
          "Publisher Name": publisher_name == '' ? '----------------' : publisher_name,
          "Camp Name": camp_name == 0 ? '----------------' : camp_name,
          Did: did,
          Cid: cid,
          Buyer_Number: buyer_id == undefined ? '----------------' : buyer_id,
          Date: date,
          CallEnd: callEnd,
          Destination: destination,
          Disposition: disposition,
          Duration: duration,
          Recordingfile: latest_date + '/' + recordingfile,
          Status: status
        };

        return csvdata;
      });
    }

    this.excelService.exportAsExcelFile(csv, 'sample');
  }

   //+++++++++++++++++++++++++ Excel Download End++++++++++++++++++++++++++++//

    //+++++++++++++++++++++++++ Csv Download++++++++++++++++++++++++++++//

  downloadCSV() {
    //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
    let csv
    if(this.publisherdropdown=='Select Publisher'){
       csv = this.data
      .map(({ date, did, destination, cid, disposition, callEnd, duration, status, recordingfile, camp_name, publisher_name, buyer_id }) => {
        let latest_date = 'https://recordingsaws1.s3-us-west-1.amazonaws.com/server34/' + this.datepipe.transform(date, 'yyyy/MM/dd');

        let csvdata = {
          publisher_name: publisher_name == '' ? '----------------' : publisher_name,
          camp_name: camp_name == 0 ? '----------------' : camp_name,
          did: did,
          cid: cid,
          buyer_id: buyer_id == undefined ? '----------------' : buyer_id,
          date: date,
          callEnd: callEnd,
          destination: destination,
          disposition: disposition,
          duration: duration,
          recordingfile: latest_date + '/' + recordingfile,
          status: status
        };

        return csvdata;
      });
    }else{
      csv = this.data
      .filter(data=>data.pub_id==this.publisherdropdown)
      .map(({ date, did, destination, cid, disposition, callEnd, duration, status, recordingfile, camp_name, publisher_name, buyer_id }) => {
        let latest_date = 'https://recordingsaws1.s3-us-west-1.amazonaws.com/server34/' + this.datepipe.transform(date, 'yyyy/MM/dd');

        let csvdata = {
          publisher_name: publisher_name == '' ? '----------------' : publisher_name,
          camp_name: camp_name == 0 ? '----------------' : camp_name,
          did: did,
          cid: cid,
          buyer_id: buyer_id == undefined ? '----------------' : buyer_id,
          date: date,
          callEnd: callEnd,
          destination: destination,
          disposition: disposition,
          duration: duration,
          recordingfile: latest_date + '/' + recordingfile,
          status: status
        };

        return csvdata;
      });
    }
    

    new AngularCsv(csv, "CdrReport", this.csvOptions);
  }
 //+++++++++++++++++++++++++ Excel Download End++++++++++++++++++++++++++++//
  closeModal(id: string) {
    this.publisherModel.close(id);
  }
  showcid: any = '';
  showdid: any = '';
  openModal(cid, did) {
    this.showcid = cid;
    this.showdid = did
    // this.publisherModel.open(id);
  }

  //++++++++++++++++++++++++++++Block Cid++++++++++++++++++++++++++++++//
  blockCid() {
    let data = { "callerid": this.showcid }
    this.service.PostBlockCid(data).subscribe((res: Response) => {
      if (res['statusCode'] == '200') {
        this.toastr.success('Status', 'CID ' + this.showcid + ' Blocked')
      } else {
        this.toastr.error('Error', 'Somthing went wrong')
      }
    })
  }
//++++++++++++++++++++++++++++Block Cid End++++++++++++++++++++++++++++++//

//++++++++++++++++++++++++++++UnBlock Cid++++++++++++++++++++++++++++++//
  unBlockCid() {
    let data = { "callerid": this.showcid }
    this.service.PostUnBlockCid(data).subscribe((res: Response) => {
      if (res['statusCode'] == '200') {
        this.toastr.success('Status', 'CID ' + this.showcid + ' Un-Blocked')
      } else {
        this.toastr.error('Error', 'Somthing went wrong')
      }
    })
  }

//++++++++++++++++++++++++++++UnBlock Cid++++++++++++++++++++++++++++++//

//++++++++++++++++++++++++++++Block Tfn++++++++++++++++++++++++++++++//
  blockCidTfn() {
    let data = { "callerid": this.showcid, "tfn": this.showdid }
    this.service.PostBlockCidTfn(data).subscribe((res: Response) => {
      if (res['statusCode'] == '200') {
        this.toastr.success('Status', 'TFN ' + this.showdid + ' Blocked for this CID' + this.showcid)
      } else {
        this.toastr.error('Error', 'Somthing went wrong')
      }

    })
  }

  //++++++++++++++++++++++++++++Block Tfn End++++++++++++++++++++++++++++++//

  //++++++++++++++++++++++++++++UnBlock Tfn++++++++++++++++++++++++++++++//
  UnblockCidTfn() {
    let data = { "callerid": this.showcid, "tfn": this.showdid }
    this.service.PostUnBlockCidTfn(data).subscribe((res: Response) => {
      if (res['statusCode'] == '200') {
        this.toastr.success('Status', `TFN ${this.showdid} Un-Blocked for this CID ${this.showcid}`)
      } else {
        this.toastr.error('Error', 'Somthing went wrong')
      }
    })
  }

  //++++++++++++++++++++++++++++UnBlock Tfn End++++++++++++++++++++++++++++++//
  filterdata() {

    this.showBuyerNumberDuplicate = false;
    this.data = [];
    //this.datadump = [];
    this.data = this.duplicatevalue;


  }

  block_tfn(event) {
    if (this.tfn_block == true) {
      this.blockCidTfn();
    } else {
      this.UnblockCidTfn();
    }

  }

  block_cid(event) {
    if (this.cid_block == true) {
      this.blockCid();
    } else {
      this.unBlockCid();
    }
  }

  //++++++++++++++++++++++++++++Count All Calls++++++++++++++++++++++++++++++//
  filterAllCount() {
    
    if (this.showBuyerNumberDuplicate == true && this.totalCallBoolean==true) {
      if (this.data && this.data.length) {
        let pub = +this.publisherdropdown;
        let buyerDrop = +this.buyerdropdown;
        let camp = +this.campaigndropdown;
        let buyer = +this.buyernumberFilter;

        let data = this.data.filter(item => {

          if (this.did && item.did.toString().indexOf(this.did.toString()) === -1) {
            return false;
          }
          if (this.destination && item.destination.toLowerCase().indexOf(this.destination.toLowerCase()) === -1) {
            return false;
          }
          if (this.disposition && item.disposition.toLowerCase().indexOf(this.disposition.toLowerCase()) === -1) {
            return false;
          }
          if (this.cid && item.cid.toLowerCase().indexOf(this.cid.toLowerCase()) === -1) {
            return false;
          }
          if (buyer && item.buyer_id.toString().indexOf(buyer.toString()) === -1) {
            return false;
          }


          if (this.buyerdropdown && item.buyer_name.toLowerCase().indexOf(this.buyerdropdown.toLowerCase()) === -1) {
            return false;
          }

          if (this.buyer_name && item.buyer_name.toLowerCase().indexOf(this.buyer_name.toLowerCase()) === -1) {
            return false;
          }

          if (this.campaigndropdown && item.camp_id.toString().indexOf(camp.toString()) === -1 && this.campaigndropdown != "Select Campaign") {
            return false;
          }
          
         // if(item.pub_id){
            if (this.publisherdropdown && item.pub_id.toString().indexOf(pub.toString()) === -1 && this.publisherdropdown != "Select Publisher") {
              return false;
            }
          //}

          return true;

        })

        this.totalcalls = data.length

        if (data != '' && data != undefined) {
          var duplicatefilter = []
          var countDuplicateFilter = 0
          var totalUniqueAnsCallsCount = 0
          var totalUniqueAnsCallsCountdup=0
          var duplicatevalue = []
          this.totalCallArray =[]
          this.totalUniqAnsCallArray =[]

          data.map(src => {
           
            if (duplicatefilter.findIndex(data => data.cid == src.cid) > -1) {

              duplicatevalue.push(src);
              countDuplicateFilter = countDuplicateFilter + 1
              /*if (src.disposition == "ANSWERED") {
                totalUniqueAnsCallsCountdup = totalUniqueAnsCallsCountdup + 1;
              }*/
            } else {

              if (src.disposition == "ANSWERED" && src.duplicate==0) {

                totalUniqueAnsCallsCount = totalUniqueAnsCallsCount + 1;
                totalUniqueAnsCallsCountdup = totalUniqueAnsCallsCountdup + 1;
                this.totalUniqAnsCallArray.push(src);

              }
              duplicatefilter.push(src);
              this.totalCallArray.push(src);
            }

          })

          if(this.totalcalls==0){
            this.totalUniqueAnsCalls=0;
            this.totalUniqueCalls=0;
            this.duplicateCount=0;
          }else{

            this.duplicateCount = countDuplicateFilter;
            this.duplicatevalue = duplicatevalue;
            this.totalUniqueCalls = this.totalcalls - countDuplicateFilter

            if (totalUniqueAnsCallsCountdup <= 0) {
              this.totalUniqueAnsCalls = this.totalUniqueCalls
            } else {
              this.totalUniqueAnsCalls =totalUniqueAnsCallsCountdup;//this.totalUniqueCalls- totalUniqueAnsCallsCountdup 
            }

            /*if (this.totalUniqueAnsCalls <= 0) {
              this.totalUniqueAnsCalls = this.totalUniqueCalls;
            }*/

          }


        }else{
          this.totalUniqueAnsCalls =0
          this.totalUniqueCalls=0
          this. duplicateCount=0
          // this.duplicatevalue=[]
        }
      }else{
          this.totalUniqueAnsCalls =0
          this.totalUniqueCalls=0
          this. duplicateCount=0
          //  this.duplicatevalue=[]
      }
    }



  }
  //++++++++++++++++++++++++++++Count All Calls End++++++++++++++++++++++++++++++//


  totalUniqueCallFunction(){
    this.totalCallBoolean=false;
    this.data = [];
    this.data = this.totalCallArray;
    this.activeStatusUnique = true; 
    this.activeStatusTotal = false; 
    this.activeStatusUniqueAns = false; 
  }

  totalUniqueAnsCallFunction(){
    this.totalCallBoolean=false;
    this.data = [];
    this.data = this.totalUniqAnsCallArray;
    this.activeStatusUniqueAns = true; 
    this.activeStatusTotal = false; 
    this.activeStatusUnique = false; 
  }

  totalCallFunction(){

    this.totalCallBoolean=true;
    this.showBuyerNumberDuplicate=true;
    this.data=[];
    this.data=this.datadump;
    this.activeStatusTotal = true;
    this.activeStatusUnique = false; 
    this.activeStatusUniqueAns = false; 
   
  }





  /*clickEventActive(event){
    if(event.target.value == 'total-call'){
      // alert();
      console.log(event.target.getAttribute('data-title'));
    }
    this.activeStatus = !this.activeStatus;       
  }*/


}


