import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { CdrService } from 'src/app/servies/cdr/cdr.service';
import { ManagePublisherService } from 'src/app/servies/user/manage-publisher.service';
import { CampaignService } from 'src/app/servies/campaign/campaign.service';
import Plyr from 'plyr';
import { PlyrComponent } from 'ngx-plyr';
import { ServiceService } from '../../services/service.service';
import { DatePipe } from '@angular/common'
import { ExcelService } from 'src/app/servies/excel.service';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { Select2OptionData } from 'ng-select2';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router, RouteReuseStrategy } from '@angular/router';
import { ManageQueueService } from 'src/app/servies/user/manage-queue.service';
import { of } from 'rxjs';
@Component({
  selector: 'app-cdr-queue-outbound',
  templateUrl: './cdr-queue-outbound.component.html',
  styleUrls: ['./cdr-queue-outbound.component.css']
})
export class CdrQueueOutboundComponent implements OnInit {

  //public data: any
  showpub=false;
  selected: any = { start: moment(), end: moment() }
  alwaysShowCalendars: boolean;
  palyer = false
  publisherdropdown="Select Publisher" 
  totalcalls: any;
  totalHandlingTime = 0;
  totalUniqueAnsCalls: any=0;
  totalUniqueCalls: any=0;
  alluser: any;
  publisher: Array<Select2OptionData>;
  pub:any=[];
  publisher_id:any;
  totalCallsLoader: boolean = true;
  totalUniqCallsLoader: boolean = true;
  totalAvgCallsLoader: boolean = true;
  totalUniqAnsweredCallsLoader: boolean = true;
  datadump:any=[];
  data:any = [];
  totalUniqueAnsCallsCount:any=0;
  totalUniqueAnsCallsCountDump:any=0
  duplicateCount:any=0
  duplicateCountDump:any=0;
  queueNumber: Array<Select2OptionData>;
  queuenum: any = [];
  QueueNumber: any = "Select Queue Number";
  pubQueue: any;
  newrole: any;
  num: any = []
  playurlname: any;
  showmethod1: any;
  status: boolean = false;
  selectedFilter: string = '';
  filtr1: boolean = false;
  filtr2: boolean = false;
  filtr3: boolean = false;
  filtr4: boolean = false;
  filtr5: boolean = false;
  filtr6: boolean = false;
  filtr7: boolean = false;
  did: any
  cid: any
  hangby: any;
  extension:any;
  statusSearch: any;
  disposition:any;
  destination:any;
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Your Cdr Outbound :',
    useBom: true,
    noDownload: false,
    headers: ["Date", "Did", "Destination", "Cid","Disposition","duration","callEnd","status","record","dupes","hangby"]
  };
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


  constructor(public sideNavService: ServiceService, public service: CdrService, public publisherservice: ManagePublisherService, public campservice: CampaignService, public datepipe: DatePipe,private excelService:ExcelService,private route:Router,public queue: ManageQueueService) {
    
    this.sideNavService.currentNameSubject.subscribe(val => {
      this.playurlname = val;
    })
    this.alwaysShowCalendars = true;
  }

  
  ngOnInit() {

    /*const helper = new JwtHelperService();
    this.alluser = localStorage.getItem('username');*/

    this.alluser = JSON.parse(localStorage.getItem('username'));
    if(!this.alluser){
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      this.route.navigate(['login']);
    }
    if(this.alluser.role == 'publisher'){
      this.publisher_id=this.publisherdropdown
    }else if(this.alluser.role == 'monitor'){
      this.publisher_id=-1;
    }else{
      this.publisher_id="";
    }

    //Publisher And Monitor Login then Queue Number And Publisher show
    if (this.alluser.role == 'publisher' || this.alluser.role == 'monitor') {
      this.publisherdropdown = this.alluser.uid;
      this.showpub = false;

      this.queue.getQueueNumberByPubId(this.alluser.uid).subscribe((res: Response) => {
        this.newrole = res['queues']
  
          if(this.newrole.length){
            
            this.newrole.map((newrole)=>{
  
              this.queue.getQueueNumberByQueueId(newrole.queue_id).subscribe((response: Response) => {
  
                this.pubQueue = response['queueNumber'];
                if(this.pubQueue.length){ 
                  this.queuenum = this.pubQueue.map((src)=>{
                    this.num.push(src.number)
                    let data = {
                      'id': src.number,
                      'text': src.number
                    }
                    return data;
                  })
                  this.queueNumber = this.queuenum; 
                   
  
              }else{
         
                this.allshowcdr('');
                this.totalCallsLoader = false;
                this.totalUniqCallsLoader = false;
                this.totalUniqAnsweredCallsLoader = false;
                this.totalAvgCallsLoader = false;
              }
                this.api();
              })
  
            })
            
  
  
          }else{
            this.allshowcdr('');
            this.totalCallsLoader = false;
            this.totalUniqCallsLoader = false;
            this.totalUniqAnsweredCallsLoader = false;
            this.totalAvgCallsLoader = false;
          }
  
        })
    } else {
      //Admin Login then Queue Number And Publisher show
      this.publisherservice.getManagePublisher().subscribe((res: Response) => {
        this.showpub = true;
        for (var i of res['user']) {
          let data = {
            'id': i.uid,
            'text': i.fullname
          }
          this.pub.push(data)
        }
        this.publisher = this.pub;
        //console.log(this.publisher);
      })
      this.queue.postQueueNumberFreepbx().subscribe((res: Response) => {
        this.pubQueue = res;
        let qnum = [];
  
          this.queuenum = this.pubQueue.map((src)=>{
            qnum.push(src.extension);
            let data = {
              'id': src.extension,
              'text': src.extension
            }
            return data;
          })
          
          this.queueNumber = this.queuenum; 
          this.num = qnum;
          this.api();
          
        });
    }
  
  }


  //=======================================================
  //Show All List of Queue 
  //========================================================
  api(){
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);

    this.service.getOutboundTotalCalls(this.publisher_id,this.num,start.getTime(), end.getTime()).subscribe((res: Response) => {
      this.totalCallsLoader = false;
      this.totalUniqCallsLoader = false;
      this.totalUniqAnsweredCallsLoader = false;
      this.totalcalls = res['totalcalls'];
      this.allshowcdr(res['cdr']);
    });

    this.service.getOutboundAHT(this.publisher_id,this.num,start.getTime(), end.getTime()).subscribe((res: Response) => {
      this.totalAvgCallsLoader = false;
      if (res['aht']['aht']) {
        this.totalHandlingTime = Math.round((res['aht']['aht']) / 60);
      } else {
        this.totalHandlingTime = 0;
      }
    });

  }
   //=======================================================
  //End Of Show All List of Queue 
  //========================================================

  //===============================================================
  //CalCulation of All cdr Queue count(duplicate call,filter data )
  //===============================================================
  allshowcdr(res) {
    //if (this.publisherdropdown != '') {

      for (var i of res) {
       // if (this.publisherdropdown == i.pub_id) {
          var diff = new Date(i.end).getTime() - new Date(i.start).getTime();
          var days = Math.floor(diff / (60 * 60 * 24 * 1000));
          var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
          var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
          var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
          // console.log(i.dst) ;

          if(i.src!=''){
            
            let cdr = {
              'date': i.start,
              'did': i.did,
              'destination': i.dst,
              'cid': i.src,
              'src': i.src,
              'disposition': i.disposition,
              "callEnd":i.end,
               'duration': hours + ':' + minutes + ':' + seconds,
              'status': i.status,
              'record': i.record,
              'dupes': i.dupes,
              'hangby': i.hangby,
              'recording': i.recordingfile,
              'camp_id': i.camp_id,
              'pub_id': i.pub_id,
              'dst': i.dst,
            }

            if (this.data.findIndex(data => data.destination == i.dst) > -1) {
              this.duplicateCount = this.duplicateCount + 1;
              this.duplicateCountDump = this.duplicateCountDump + 1;
            }

            if (cdr.disposition == "ANSWERED") {
              this.totalUniqueAnsCallsCount = this.totalUniqueAnsCallsCount + 1;
              this.totalUniqueAnsCallsCountDump = this.totalUniqueAnsCallsCountDump + 1
            }
            this.datadump.push(cdr);
            this.data.push(cdr)
          }
          
          this.totalUniqueCalls = this.totalcalls - this.duplicateCount

          if(this.totalUniqueAnsCallsCount!=0){
            if(this.totalUniqueAnsCallsCount<=0){
               this.totalUniqueAnsCalls = this.totalUniqueCalls
            }else{
              this.totalUniqueAnsCalls = (this.totalUniqueAnsCallsCount - this.duplicateCount)
            }
            if(this.totalUniqueAnsCalls<=0){
              this.totalUniqueAnsCalls=this.totalUniqueCalls;
            }

          }else{
            this.totalUniqueAnsCalls=0;
          }
        
          
        }
   
    //this.data.reverse();
    this.totalCountFilter();
    if (this.data == '') {
      this.showmethod1 = "no data";
    } else {
      this.showmethod1 = "";
    }
  }
  //===============================================================
  //End CalCulation of All cdr Queue count(duplicate call,filter data )
  //===============================================================

  //===============================================================
  //Side Filter Show and hide
  //===============================================================
  clickFilter() {
    this.status = !this.status;
  }
  //===============================================================
  //Side Filter Show and hide
  //===============================================================

  //===============================================================
  //Side Filter Show and hide  value
  //===============================================================
  closefiltr(num) {
    if (num == 'filtr1') {
      this.extension = '';
    }
    if (num == 'filtr2') {
      this.disposition='';
    }
    if (num == 'filtr3') {
      this.destination = '';
    }
    // if (num == 'filtr4') {
    //   this.hangby = '';
    // }
    // if (num == 'filtr5') {
    //   this.statusSearch = '';
    // }
    this.repeatvalue();
    // if(num=='filtr2'){
    //   this.did='';
    // }
   // this[num] = false;
  }
  //===============================================================
  //Side Filter Show and hide  value
  //===============================================================

    //===============================================================
  //All Rest Filter 
  //===============================================================
  resetfilter(){
    this.did = '';
    this.destination = '';
    this.cid = '';
    this.repeatvalue();
  }
    //===============================================================
  //All Rest Filter 
  //===============================================================

    //===============================================================
  //Change  Queue Number Dropdown
  //=============================================================
  changeQueueNumber(){
    this.totalCountFilter();
  }
   //===============================================================
  //Change  Queue Number Dropdown
  //=============================================================

   //===============================================================
  //Change Date thne Filter Data 
  //===============================================================
  submit() {
      this.showmethod1 = "loading"
      this.totalCallsLoader = true;
      this.totalUniqCallsLoader = true;
      this.totalAvgCallsLoader = true;
      this.totalUniqAnsweredCallsLoader = true;
      if (this.selected.startDate) {
      this.service.getOutboundTotalCalls(this.publisher_id,this.num,this.selected.startDate._d.getTime(), this.selected.endDate._d.getTime()).subscribe((res: Response) => {
        //console.log(res);
        this.totalCallsLoader = false;
        this.totalUniqCallsLoader = false;
        this.totalUniqAnsweredCallsLoader = false;
        this.totalcalls = res['totalcalls'];
        this.allshowcdr(res['cdr']);
        
      })
      this.service.getOutboundAHT(this.publisher_id,this.num,this.selected.startDate._d.getTime(), this.selected.endDate._d.getTime()).subscribe((res: Response) => {
        this.totalAvgCallsLoader = false;
        if (res['aht']['aht']) {
          this.totalHandlingTime = Math.round((res['aht']['aht']) / 60);
        } else {
          this.totalHandlingTime = 0;
        }
      });
    }

  }
  //===============================================================
  // End Change Date thne Filter Data 
  //=============================================================

    //===============================================================
  //Audio Play 
  //=============================================================
  playfor(path, date) {
    let latest_date = this.datepipe.transform(date, 'yyyy/MM/dd');
    let data ='https://recordingsaws1.s3-us-west-1.amazonaws.com/'+ latest_date + '/' + path
    this.sideNavService.currentNameSubject.next(data)
    this.sideNavService.mplay();
  }
    //===============================================================
  //Audio Play 
  //=============================================================

    //===============================================================
  //Reset Publisher Dropdown
  //=============================================================
  reset() {
    this.totalCallsLoader = true;
    this.totalUniqCallsLoader = true;
    this.totalAvgCallsLoader = true;
    this.totalUniqAnsweredCallsLoader = true;
    this.publisherdropdown='Select Publisher'
    this.ngOnInit();
  }
//===============================================================
  //End Reset Publisher Dropdown
  //============================================================

  //===========================================================
  //Download Excel File
  //===========================================================
  exportAsXLSX():void {
    let csv=this.data.map(({date,did,extension,destination,cid,disposition,duration,recordingfile})=>{
      let csvdata={
        Date:date,
        Did:did,
        Extension:extension,
        Destination:destination,
        Cid:cid,
        Disposition:disposition,
        Duration:duration,
        Recordingfile:recordingfile,
      };
      return csvdata;
    })
    this.excelService.exportAsExcelFile(csv, 'sample');
  }


  //===============================================================
  //Download Csv File
  //===========================================================
  downloadCSV(){
    let csv=this.data.map(({date,did,extension,destination,cid,disposition,duration,recordingfile})=>{
      let csvdata={
        Date:date,
        Did:did,
        Extension:extension,
        Destination:destination,
        Cid:cid,
        Disposition:disposition,
        Duration:duration,
        Recordingfile:recordingfile,
      };
      return csvdata;
    })
    //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
    new  AngularCsv(csv, "CdrOutbound", this.csvOptions);
  }
  resetQueue() {
    this.QueueNumber = "Select Queue Number"
    this.totalCountFilter();
  }
//============================================================
  //End Download Csv File
  //===========================================================

  //===========================================================
  //Counting number of Total Call And total Ans Call using Filter
  //===========================================================
  totalCountFilter(){
    
    console.log(this.data);
    if (this.data && this.data.length) {

        let data = this.data.filter(item => {

          if (this.extension && item.src.toString().indexOf(this.extension.toString()) === -1) {
            return false;
          }

          if (this.destination && item.destination.toLowerCase().indexOf(this.destination.toLowerCase()) === -1) {
            return false;
          }
        
          if(this.publisherdropdown && this.alluser.role!='monitor' && item.pub_id.toString().indexOf(this.publisher_id.toString()) === -1 && this.publisherdropdown != "Select Publisher" ) {
            return false;
          }
          if (this.QueueNumber && item.destination.toString().indexOf(this.QueueNumber.toString()) === -1 && this.QueueNumber != "Select Queue Number" ) {
          
            return false;
          }

        return true;
      })


        this.totalcalls = data.length
        let duplicatefilter = []
        let countDuplicateFilter = 0
        let totalUniqueAnsCallsCount = 0

        data.map(src => {
          if (src.disposition == "ANSWERED") {
            totalUniqueAnsCallsCount = totalUniqueAnsCallsCount + 1;
          }
          if (duplicatefilter.findIndex(data => data.destination == src.destination) > -1) {
            countDuplicateFilter = countDuplicateFilter + 1
          } else {
            duplicatefilter.push(src);
          }

        })
        this.duplicateCount = countDuplicateFilter;
          this.totalUniqueCalls = this.totalcalls - countDuplicateFilter
          if(totalUniqueAnsCallsCount!=0){
          if(totalUniqueAnsCallsCount<=0){
            this.totalUniqueAnsCalls = this.totalUniqueCalls
          }else{
            this.totalUniqueAnsCalls = totalUniqueAnsCallsCount - countDuplicateFilter
          }
          if(this.totalUniqueAnsCalls<=0){
            this.totalUniqueAnsCalls=this.totalUniqueCalls;
          }
        }else{
          this.totalUniqueAnsCalls=0;
        }
    }
    
  }
  //===========================================================
  //End Counting number of Total Call And total Ans Call using Filter
  //===========================================================

    //===========================================================
  //Rest All Data 
  //===========================================================
 refreshalldata() {
    

  this.totalCallsLoader = true;
  this.totalUniqCallsLoader = true;
  this.totalAvgCallsLoader = true;
  this.totalUniqAnsweredCallsLoader = true;
  this.data=[];
  this.showmethod1 = "loading"
  this.ngOnInit()
    
  }
  //===========================================================
  //End Rest All Data 
  //===========================================================

 //===========================================================
  //Filter all Repated removed
  //===========================================================
  repeatvalue() {
  
    this.data = this.datadump;
    this.totalCountFilter();
  
  }
  //===========================================================
  //End Filter all Repated removed
  //===========================================================
  
    //===============================================================
  //Change Publisher Dropdown
  //============================================================
  changepublisher(){
    this.totalCallsLoader=true
    this.totalUniqCallsLoader=true
    this.totalUniqAnsweredCallsLoader=true
    this.totalAvgCallsLoader=true
    if(this.selected.startDate){
      this.submit();
    }else{
      this.ngOnInit();
    }
  }
  //===============================================================
  //End change Publisher Dropdown
  //============================================================

}
