import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CdrQueueService } from 'src/app/servies/cdr/cdr-queue.service';
import { CdrService } from 'src/app/servies/cdr/cdr.service';
import { ManagePublisherService } from 'src/app/servies/user/manage-publisher.service';
import { ServiceService } from '../../services/service.service';
import { DatePipe } from '@angular/common';
import { Select2OptionData } from 'ng-select2';
import { ExcelService } from 'src/app/servies/excel.service';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { ManageQueueService } from 'src/app/servies/user/manage-queue.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
@Component({
  selector: 'app-cdr-queue',
  templateUrl: './cdr-queue.component.html',
  styleUrls: ['./cdr-queue.component.css']
})
export class CdrQueueComponent implements OnInit {
  public data: any;
  alwaysShowCalendars: boolean;
  //Loader Of the page
  totalCallsLoader: boolean = true;
  totalUniqCallsLoader: boolean = true;
  totalAvgCallsLoader: boolean = true;
  totalUniqAnsweredCallsLoader: boolean = true;
  //Loader Of the page

  //Show Total handling Time
  totalHandlingTime: any = [];
  //Show Total Call
  totalcalls: any;
  //Show Total Unique Ans Call
  totalUniqueAnsCalls: any = 0;
  //Show Total Unique Call
  totalUniqueCalls: any = 0;
  queueNumber: Array<Select2OptionData>;
  queuenum: any = [];
  playurlname: any;
  dispsition: any;
  publisherdropdown: any = "Select Publisher";
  publisherdropdownNew: any;
  QueueNumber: any = "Select Queue Number";
  did: any
  destination: any
  cid: any
  hangby: any
  statusSearch: any;
  extension: any;
  showBuyerNumberDuplicate = true;
  pub: any = [];
  public publisher: Array<Select2OptionData>;
  alluser: any;
  showpub: any;
  pubQueue: any;
  newrole: any;
  num: any = []
  duplicatevalue: any = []
  duplicatevaluedump: any = []
  duplicateCount: any = 0;
  duplicateCountDump: any = 0;
  datadump: any = []
  totalUniqueAnsCallsCount: any = 0
  totalUniqueAnsCallsCountDump: any = 0;
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
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Your CdrQueue List :',
    useBom: true,
    noDownload: false,
    headers: ["Date", "Did", "Extension", "Destination", "Cid", "Disposition", "Duration", "Recording"]
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




  selected: any = { start: moment(), end: moment() }
  constructor(public services: CdrQueueService, public service: CdrQueueService, public publisherservice: ManagePublisherService, public sideNavService: ServiceService, public datepipe: DatePipe, private excelService: ExcelService, public queue: ManageQueueService, public route: Router) {
    this.alwaysShowCalendars = true;
    this.sideNavService.currentNameSubject.subscribe(val => {
      this.playurlname = val;
    })
  }

  ngOnInit() {
    //=================Auth part ===================================
    const helper = new JwtHelperService();
    // this.alluser = helper.decodeToken(localStorage.getItem('token'));
    // const expirationDate = helper.getTokenExpirationDate(localStorage.getItem('token'));
    // const isExpired = helper.isTokenExpired(localStorage.getItem('token'));
    // console.log(decodedToken);
    //=================Auth part ===================================


    this.alluser = JSON.parse(localStorage.getItem('username'));
    if (!this.alluser) {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      this.route.navigate(['login']);
    }

    if (this.alluser.role == 'publisher') {
      this.publisherdropdownNew = this.publisherdropdown
    } else if (this.alluser.role == 'monitor') {
      this.publisherdropdownNew = -1;
    } else {
      this.publisherdropdownNew = "";
    }

    this.showcontent();
  }

  //=======================================================
  //DropDown Publisher And Queue Number
  //========================================================
  showcontent() {
 
    //Publisher And Monitor Login then Queue Number And Publisher show
    if (this.alluser.role == 'publisher') {
      this.publisherdropdownNew = this.alluser.uid;

      this.showpub = false;

      this.queue.getQueueNumberByPubId(this.alluser.uid).subscribe((res: Response) => {
      this.newrole = res['queues']
      

        if (this.newrole.length) {

          this.newrole.map((newrole) => {

            this.queue.getQueueNumberByQueueId(newrole.queue_id).subscribe((response: Response) => {

              this.pubQueue = response['queueNumber'];
              if (this.pubQueue.length) {
                this.queuenum = this.pubQueue.map((src) => {
                  this.num.push(src.number)
                  let data = {
                    'id': src.number,
                    'text': src.number
                  }
                  return data;
                })
                this.queueNumber = this.queuenum;
                this.api();

              } else {

                this.allshowcdr('');
                this.totalCallsLoader = false;
                this.totalUniqCallsLoader = false;
                this.totalUniqAnsweredCallsLoader = false;
                this.totalAvgCallsLoader = false;
              }

            })

          })



        } else {
          this.allshowcdr('');
          this.totalCallsLoader = false;
          this.totalUniqCallsLoader = false;
          this.totalUniqAnsweredCallsLoader = false;
          this.totalAvgCallsLoader = false;
        }

      })

    }else if(this.alluser.role == 'monitor'){
            this.publisherdropdownNew = this.alluser.uid;

            this.showpub = false;

            this.queue.getQueueNumberByQueueId(this.alluser.uid).subscribe((response: Response) => {

              this.pubQueue = response['queueNumber'];

              if (this.pubQueue.length) {
                this.queuenum = this.pubQueue.map((src) => {
                  this.num.push(src.number)
                  let data = {
                    'id': src.number,
                    'text': src.number
                  }
                  return data;
                })
                this.queueNumber = this.queuenum;
                this.api();


              } else {

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

        this.publisher = res['user'].map((src) => {
          let data = {
            'id': src.uid,
            'text': src.fullname
          }
          return data;
        })

      })
      this.queue.postQueueNumberFreepbx().subscribe((res: Response) => {
        this.pubQueue = res;
        let qnum = [];

        this.queuenum = this.pubQueue.map((src) => {
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
  //End Of DropDown Publisher And Queue Number
  //========================================================

  //=======================================================
  //Show All List of Queue 
  //========================================================
  api() {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);

    /*if (this.alluser.role != 'publisher' && this.alluser.role !='monitor') {
      if (this.publisherdropdown == 'select Publisher' || this.QueueNumber == 'Select Queue Number') {
        this.publisherdropdown = '';
        this.QueueNumber = '';
        this.publisherdropdownNew='';
        this.num = ''
      }
    } else {
      this.QueueNumber = ''
    }

  if (this.publisherdropdownNew != 'Select Publisher'  ) {

    
      if(this.alluser.role=="admin"){
        if(this.publisherdropdown!='Select Publisher'){
        this.publisherdropdownNew=this.publisherdropdown;
        }else{
          this.publisherdropdownNew=''
        }
      }*/

    //Api of show Total Cdr Report
    this.service.getAllQueueCdr(this.publisherdropdownNew, this.num, start.getTime(), end.getTime()).subscribe((res: Response) => {
      //this.showmethod1 = "loading"
      this.totalCallsLoader = false;
      this.totalUniqCallsLoader = false;
      this.totalUniqAnsweredCallsLoader = false;
      this.totalcalls = res['totalcalls'];
      this.allshowcdr(res['queueReport']);

    });

    //Api of show Total Hendling Time
    this.service.getAHT(start.getTime(), end.getTime(), this.publisherdropdownNew, this.num).subscribe((res: Response) => {
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
    this.data = [];
    this.datadump = [];
    this.duplicatevalue = [];
    this.duplicateCount = 0
    this.totalUniqueAnsCallsCount = 0
    this.totalUniqueAnsCallsCountDump = 0
    for (var i of res) {
      //hours,minutes, seconds show
      var new1 = i.callend - i.callstart;
      var diff = new Date(i.callend).getTime() - new Date(i.callstart).getTime();
      var days = Math.floor(diff / (60 * 60 * 24 * 1000));
      var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
      var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
      var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
      //End hours,minutes, seconds show
      var extnsn = ''
      if (i.dstchannel != " ") {
        var dstchannel = i.dstchannel.split('@')
        var channel = dstchannel[0].split('/');
        extnsn = channel[1];
      }
      if (i.did != '') {
        let cidduplicate = 0
        // Condtion For Checking Duplicate Call
        if (this.data.findIndex(data => data.cid == i.src) > -1) {
          this.duplicateCount = this.duplicateCount + 1;
          this.duplicateCountDump = this.duplicateCountDump + 1;
          cidduplicate = 1
          let duplicateCdr = {
            'date': i.callstart,
            'did': i.did,
            'destination': i.dst,
            'cid': i.src,
            'disposition': i.dstchannel != "" ? i.disposition : 'MISSED CALL',
            "callEnd": i.callend,
            'duration': hours + ':' + minutes + ':' + seconds,
            'extension': extnsn,
            'status': i.status,
            'record': i.record,
            'dupes': i.dupes,
            'hangby': i.hangby,
            'recordingfile': i.recordingfile,
            'pub_id': i.pub_id,
            'duplicate': cidduplicate,
            'publisherName': i.publisherName
          }

          this.duplicatevalue.push(duplicateCdr);
          this.duplicatevaluedump.push(duplicateCdr);
        }
        let cdr = {
          'date': i.callstart,
          'did': i.did,
          'destination': i.dst,
          'cid': i.src,
          'disposition': i.dstchannel != "" ? i.disposition : 'MISSED CALL',
          "callEnd": i.callend,
          'duration': hours + ':' + minutes + ':' + seconds,
          'extension': extnsn,
          'status': i.status,
          'record': i.record,
          'dupes': i.dupes,
          'hangby': i.hangby,
          'recordingfile': i.recordingfile,
          'pub_id': i.pub_id,
          'duplicate': cidduplicate,
          'publisherName': i.publisherName
        }
        if (cdr.disposition == "ANSWERED") {
          this.totalUniqueAnsCallsCount = this.totalUniqueAnsCallsCount + 1;
          this.totalUniqueAnsCallsCountDump = this.totalUniqueAnsCallsCountDump + 1
        }
        //real data Show 
        this.data.push(cdr)
        //dumy data Show 
        this.datadump.push(cdr);
      }


    }
    this.totalUniqueCalls = this.totalcalls - this.duplicateCount
    if (this.totalUniqueAnsCallsCount <= 0) {
      this.totalUniqueAnsCalls = this.totalUniqueCalls
    } else {
      this.totalUniqueAnsCalls = (this.totalUniqueAnsCallsCount - this.duplicateCount)
    }
    if (this.totalUniqueAnsCalls <= 0) {
      this.totalUniqueAnsCalls = this.totalUniqueCalls;
    }
    this.totalCountFilter()

   // this.data.reverse();
    if (this.data == '') {
      this.showmethod1 = "no data";
    } else {
      this.showmethod1 = "";
    }
  }
  //===============================================================
  //CalCulation of All cdr Queue count(duplicate call,filter data )
  //===============================================================

  //===============================================================
  //Show Duplicate Data
  //===============================================================
  allDulicateData() {
    this.showBuyerNumberDuplicate = false;
    this.data = [];
    this.datadump = [];
    this.data = this.duplicatevalue;
  }
  //===============================================================
  //End Show Duplicate Data
  //===============================================================

  //===============================================================
  //Side Filter Show and hide
  //===============================================================
  clickFilter() {
    // alert();
    this.status = !this.status;
  }
  //===============================================================
  //Side Filter Show and hide
  //===============================================================


  setting: boolean = false;
  clicksetting() {
    // alert();
    this.setting = !this.setting;
  }

  //===============================================================
  //Side Filter Show and hide  value
  //===============================================================
  closefiltr(num) {
    if (num == 'filtr1') {
      this.did = '';
    }
    if (num == 'filtr2') {
      this.destination = '';
    }
    if (num == 'filtr3') {
      this.cid = '';
    }
    if (num == 'filtr4') {
      this.hangby = '';
    }
    if (num == 'filtr5') {
      this.dispsition = '';
    }
    if (num == 'filtr6') {
      this.extension = '';
    }
    this.repeatvalue();
    // this[num] = false;
  }
  //===============================================================
  //Side Filter Show and hide  value
  //===============================================================

  //===============================================================
  //All Rest Filter 
  //===============================================================
  resetFilter() {
    this.did = '';
    this.destination = '';
    this.cid = '';
    this.dispsition = '';
    this.extension = '';
    this.repeatvalue();
  }
  //===============================================================
  //All Rest Filter 
  //===============================================================

  //===============================================================
  //Change Date thne Filter Data 
  //===============================================================
  submit() {
    this.showmethod1 = "loading"
    this.totalCallsLoader = true;
    this.totalUniqCallsLoader = true;
    this.totalAvgCallsLoader = true;
    this.totalUniqAnsweredCallsLoader = true;
    //  console.log(this.publisherdropdown);
    //  console.log(this.QueueNumber);
    /*if (this.alluser.role != 'publisher') {
      if (this.publisherdropdown == 'select Publisher' || this.QueueNumber == 'Select Queue Number') {
        this.publisherdropdown = '';
        this.QueueNumber = ''
      }
    }
    if (this.publisherdropdownNew != 'Select Publisher') {
      if(this.alluser.role=="admin"){
        if(this.publisherdropdown!='Select Publisher'){
          this.publisherdropdownNew=this.publisherdropdown;
          }else{
            this.publisherdropdownNew=''
          }
      }*/
    let start
    let end
    if (this.selected.startDate) {
      start = this.selected.startDate._d.getTime();
      end = this.selected.endDate._d.getTime()
    } else {
      var start1 = new Date();
      start1.setHours(0, 0, 0, 0);
      start = start1.getTime();
      var end1 = new Date();
      end1.setHours(23, 59, 59, 999);
      end = end1.getTime();
      //console.log(end.getTime())
    }


    this.service.getAllQueueCdr(this.publisherdropdownNew, this.num, start, end).subscribe((res: Response) => {
      // console.log(res);
      this.showmethod1 = "loading"
      this.totalCallsLoader = false;
      this.totalUniqCallsLoader = false;
      this.totalUniqAnsweredCallsLoader = false;
      this.totalcalls = res['totalcalls'];
      this.allshowcdr(res['queueReport']);

    })
    this.service.getAHT(start, end, this.publisherdropdownNew, this.num).subscribe((res: Response) => {
      this.totalAvgCallsLoader = false;
      if (res['aht']['aht']) {
        this.totalHandlingTime = Math.round((res['aht']['aht']) / 60);
      } else {
        this.totalHandlingTime = 0;
      }
    });
    /*this.service.getUniqueAnsCalls(start, end, this.publisherdropdownNew, this.QueueNumber).subscribe((res: Response) => {

      this.totalUniqueAnsCalls = res['totaluniqueansweredcalls'];
    });
    this.service.getAllUniqueCalls(start, end, this.publisherdropdownNew, this.QueueNumber).subscribe((res: Response) => {

      this.totalUniqueCalls = res['totaluniquecalls'];
    });
    }*/
    /*} else {
      alert("Please Select Queue Number And Publisher Name")
    }*/
    //console.log(this.selected.startDate._d.getTime());

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
  //Reset Queue Number
  //=============================================================
  reset() {


    this.QueueNumber = "Select Queue Number"
    this.totalCountFilter();

    // this.showcontent();
    // location.reload()
  }
  //===============================================================
  //End Reset Queue Number
  //=============================================================

  //===============================================================
  //Change  Queue Number Dropdown
  //=============================================================
  changeQueueNumber() {
    this.totalCountFilter();
  }
  //===============================================================
  //Change  Queue Number Dropdown
  //=============================================================

  //===============================================================
  //Reset Publisher Dropdown
  //=============================================================
  resetpublisher() {
    this.totalCallsLoader = true
    this.totalUniqCallsLoader = true
    this.totalUniqAnsweredCallsLoader = true
    this.totalAvgCallsLoader = true
    this.publisherdropdown = "Select Publisher";
    this.submit();
  }
  //===============================================================
  //End Reset Publisher Dropdown
  //============================================================

  //===============================================================
  //Change Publisher Dropdown
  //============================================================
  changepublisher() {
    this.totalCallsLoader = true
    this.totalUniqCallsLoader = true
    this.totalUniqAnsweredCallsLoader = true
    this.totalAvgCallsLoader = true

    if (this.selected.startDate) {
      this.submit();
    } else {
      this.showcontent();
    }

  }
  //===============================================================
  //End change Publisher Dropdown
  //============================================================

  //===============================================================
  //Download Csv File
  //===========================================================
  downloadCSV() {
    //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options

    let csv = this.data.map(({ date, did, extension, destination, cid, disposition, duration, recordingfile }) => {
      let csvdata = {
        date: date,
        did: did,
        extension: extension,
        destination: destination,
        cid: cid,
        disposition: disposition,
        duration: duration,
        recordingfile: recordingfile,
      };
      return csvdata;
    })



    new AngularCsv(csv, "CdrQueue", this.csvOptions);
  }
  //============================================================
  //End Download Csv File
  //===========================================================

  //===========================================================
  //Download Excel File
  //===========================================================
  exportAsXLSX(): void {
    let csv = this.data.map(({ date, did, extension, destination, cid, disposition, duration, recordingfile }) => {
      let csvdata = {
        Date: date,
        Did: did,
        Extension: extension,
        Destination: destination,
        Cid: cid,
        Disposition: disposition,
        Duration: duration,
        Recordingfile: recordingfile,
      };
      return csvdata;
    })
    this.excelService.exportAsExcelFile(csv, 'sample');
  }
  //===============================================================
  //End Download Excel File
  //===========================================================

  //===========================================================
  //Counting number of Total Call And total Ans Call using Filter
  //===========================================================
  totalCountFilter() {
    if (this.showBuyerNumberDuplicate == true) {
      if (this.data && this.data.length) {
        let data = this.data.filter(item => {
          if (this.did && item.did.toString().indexOf(this.did.toString()) === -1) {
            return false;
          }
          if (this.extension && item.extension.toString().indexOf(this.extension.toString()) === -1) {
            return false;
          }
          if (this.destination && item.destination.toLowerCase().indexOf(this.destination.toLowerCase()) === -1) {
            return false;
          }
          if (this.dispsition && item.disposition.toLowerCase().indexOf(this.dispsition.toLowerCase()) === -1) {
            return false;
          }
          if (this.cid && item.cid.toLowerCase().indexOf(this.cid.toLowerCase()) === -1) {
            return false;
          }





          // if (this.publisherdropdown && item.pub_id.toString().indexOf(this.pub.toString()) === -1 && this.publisherdropdown != "Select Publisher" ) {

          //   return false;
          // }
          //}
          if (this.QueueNumber && item.destination.toString().indexOf(this.QueueNumber.toString()) === -1 && this.QueueNumber != "Select Queue Number") {

            return false;
          }
          return true;
        });
        this.totalcalls = data.length
        //if (data != '' && data != undefined) {
        var duplicatefilter = []
        var countDuplicateFilter = 0
        var totalUniqueAnsCallsCount = 0
        var duplicatevalue = []
        data.map(src => {
          if (src.disposition == "ANSWERED") {
            totalUniqueAnsCallsCount = totalUniqueAnsCallsCount + 1;
          }
          if (duplicatefilter.findIndex(data => data.cid == src.cid) > -1) {

            duplicatevalue.push(src);
            countDuplicateFilter = countDuplicateFilter + 1
          } else {
            duplicatefilter.push(src);
          }

        })
        //console.log(countDuplicateFilter);
        this.duplicateCount = countDuplicateFilter;
        this.duplicatevalue = duplicatevalue;
        this.totalUniqueCalls = this.totalcalls - countDuplicateFilter
        if (totalUniqueAnsCallsCount <= 0) {
          this.totalUniqueAnsCalls = this.totalUniqueCalls
        } else {
          this.totalUniqueAnsCalls = totalUniqueAnsCallsCount - countDuplicateFilter
        }
        if (this.totalUniqueAnsCalls <= 0) {
          this.totalUniqueAnsCalls = this.totalUniqueCalls;
        }

        // }
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

    this.showBuyerNumberDuplicate = true;
    this.totalCallsLoader = true;
    this.totalUniqCallsLoader = true;
    this.totalAvgCallsLoader = true;
    this.totalUniqAnsweredCallsLoader = true;
    this.data = [];
    this.showmethod1 = "loading"
    this.showcontent()

  }
  //===========================================================
  //End Rest All Data 
  //===========================================================

  //===========================================================
  //Filter all Repated removed
  //===========================================================
  repeatvalue() {
    if (this.showBuyerNumberDuplicate == true) {
      this.data = this.datadump;
      this.totalCountFilter();
    }
  }
  //===========================================================
  //End Filter all Repated removed
  //===========================================================



}
