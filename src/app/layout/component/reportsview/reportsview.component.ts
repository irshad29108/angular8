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
import { ChartDataSets, ChartOptions} from 'chart.js';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reportsview',
  templateUrl: './reportsview.component.html',
  styleUrls: ['./reportsview.component.css']
})
export class ReportsviewComponent implements OnInit {

color='#ffc36d';
apiEndPont:any='';
public data : any ;
colorvalue:any;
public lineChartData1: ChartDataSets[] = [
    { data: [], label: 'Total Calls: ' },
    { data: [], label: 'Total Unique Calls: ' },
    { data: [], label: 'Total Unique Answered Calls: ' },
    { data: [], label: 'AHT: ' },
  ];
 public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Total Calls: ' },
    { data: [], label: 'Total Unique Calls: ' },
    { data: [], label: 'Total Unique Answered Calls: ' },
    { data: [], label: 'AHT: ' },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartLabels1: Label[] = [];
  // public lineChartOptions: (ChartOptions & { annotation: any }) = {
  //   responsive: true,
  // };


  public lineChartColors: Color[] = [
    {
      borderColor: '#53e9ff',
       backgroundColor: 'rgba(83, 233, 255, 0)',
    },
    {
      borderColor: '#0024c7',
       backgroundColor: 'rgba(83, 233, 255, 0)',
    },
    {
      borderColor: '#fdc006',
      backgroundColor: 'rgba(253, 192, 6, 0)',
    },
    {
      borderColor: '#9675ce',
      backgroundColor: 'rgba(150, 117, 206, 0)',
    },
  ];
  public lineChartLegend = true;
  public lineChartLegend1 = true;
  public lineChartType = 'line';
  public lineChartType1 = 'line';
  public lineChartPlugins = [];
  public lineChartPlugins1 = [];



  did: any
  showpub:any;
  destination: any
  cid: any
  hangby: any;
  publisherdropdown:any="Select Publisher";
  statusSearch: any
  alwaysShowCalendars: boolean;
  palyer:boolean=false;
  loader:boolean=false;
  totalCallsLoader:boolean=true;
  totalUniqCallsLoader:boolean=true;
  totalAvgCallsLoader:boolean=true;
  totalUniqAnsweredCallsLoader:boolean=true;
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
  totalcalls: any;
  totalHandlingTime:number=0;
  totalUniqueAnsCalls: any;
  totalUniqueCalls: any;
  pub: any=[];
  campaign: any=[];
  public publisher: Array<Select2OptionData>;
  public exampleData: Array<Select2OptionData>;
  campaigndropdown:any="Select Campaign";
  alluser = JSON.parse(localStorage.getItem('username'));
  playurlname:any;
  buyer: any;
  namedatils:any
  constructor(public dservice:DashboardService, private route: ActivatedRoute,public sideNavService: ServiceService, public service: CdrService, public publisherservice: ManagePublisherService, public campservice: CampaignService,public buyerservice:ManageBuyersService,public datepipe: DatePipe,private excelService:ExcelService) {
    this.alwaysShowCalendars = true;
    this.sideNavService.currentNameSubject.subscribe(val=>{
      this.playurlname=val;
    })
    // console.log(this.selected);
  }
  camp:any;
  showmethod1:any;
  publisher_id:any;

  ngOnInit() {
    var id = this.route.snapshot.paramMap.get('id');
  
    if(id!=null){
      var camp = id.split("&");
    this.namedatils =id.split("@");
   // console.log(this.namedatils);return;
    var name=this.namedatils[1].split("&")
    if(name[0]=='publish'){
      this.publisherdropdown = camp[1];
    }else if(name[0]=='camp'){
      this.campaigndropdown = camp[1];
    }else{
     // console.log("sdafs")
    }
    }

    if(this.alluser.role == 'publisher'){
      this.publisher_id=this.alluser.uid
    }else if(this.alluser.role == 'monitor'){
      this.publisher_id=-1;
    }else{
      this.publisher_id="";
    }
    
    //this.campaigndropdown = camp[1];
   
  //  this.campaigndropdown=id
    let data='';
    this.loader=true;
  // console.log(this.publisherdropdown);
   this.colorvalue='hourly';
    this.dservice.getHourlyReport(this.campaigndropdown,this.publisherdropdown).subscribe((res:Response)=>{
      this.loader=false;
      
      this.lineChartLabels=res['weekly']['week']
      this.lineChartData=res['weekly']['data']
      
    })

    this.exampleData = [
      {
        id: 'basic1',
        text: 'Basic 1'
      },
      {
        id: 'basic2',
        disabled: true,
        text: 'Basic 2'
      },
      {
        id: 'basic3',
        text: 'Basic 3'
      },
      {
        id: 'basic4',
        text: 'Basic 4'
      }
    ];
   
    this.showcontent();
  }
  buyernum:any;
  showcontent(){
   
    let url='';
    if (this.alluser.role == 'publisher') {
      url='?pub_id='+this.alluser.uid
    }
   
    this.campservice.getallcampaign().subscribe((res: Response) => {
      this.camp = res['campaigns'];
      if(this.alluser.role=='publisher'){
        for(var i of this.camp){
          if(i.pub_id==this.alluser.uid){
             let data={
               'id':i.campaign_id,
               'text':i.camp_name,
              
             }
            this.campaign.push(data);
          }
          this.exampleData=this.campaign
        }
          
      }else{
        for(var i of this.camp){
          let data={
            'id':i.campaign_id,
            'text':i.camp_name,
           
          }
         this.campaign.push(data);
        }
        this.exampleData=this.campaign
        // this.campaign=this.camp;
      }
      
      //console.log(this.campaign);

    })
   
    if(this.alluser.role=='publisher' || this.alluser.role=='buyer'){
      //this.publisherdropdown=this.alluser.uid;
      this.showpub=false;
    }else{
      this.publisherservice.getManagePublisher().subscribe((res: Response) => {
        // let pub = res['user'];
        // console.log(res['user'])
        this.showpub=true;
        for(var i of res['user']){
          let data={
            'id':i.uid,
            'text':i.fullname
          }
          this.pub.push(data)
        }
        this.publisher=this.pub;
       
       // console.log(this.publisher);
      }) 
    }

    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    // console.log(end.getTime());
    
      this.buyerservice.getNumberByid(this.alluser.uid).subscribe((res: Response) => {
        this.buyer = res['buyerNumber'];
        
        this.buyernum=this.buyer.map(({ number }) => number).join(',')
        
      
    if(this.alluser.uid=='buyer'){
      url='?buyerNumber=['+this.buyernum+']'
    }

    this.service.getTotalCalls(start.getTime(), end.getTime(),url).subscribe((res: Response) => {
      //this.showmethod1 = "loading"
      this.totalCallsLoader=false;
      this.totalUniqCallsLoader = false;
      this.totalUniqAnsweredCallsLoader = false;
      this.totalcalls = res['totalcalls'];
      var data=[];
      var countUniqueAns=0
     res['cdr'].map(({src,dstchannel,disposition})=>{
      var extnsn = ''
      if (dstchannel != " ") {

        var dstchannel = dstchannel.split('@')

        var channel = dstchannel[0].split('/');

        extnsn = channel[1];
      }
       
          let ciddata={
            src:src,
            disposition:dstchannel != "" ? disposition : 'MISSED CALL'
          }
          if (ciddata.disposition == "ANSWERED") {
            countUniqueAns=countUniqueAns+1
          }
          if(data.findIndex(data=>data.src==src)==-1){
         data.push(ciddata)
        }
       
      })
      this.totalUniqueCalls=data.length
      console.log(data);
      //this.totalUniqueAnsCalls=countUniqueAns;
      if (countUniqueAns <= 0) {
        this.totalUniqueAnsCalls = this.totalUniqueCalls
      } else {
        this.totalUniqueAnsCalls = (countUniqueAns - (this.totalcalls-this.totalUniqueCalls))
      }
      if (this.totalUniqueAnsCalls <= 0) {
        this.totalUniqueAnsCalls = this.totalUniqueCalls;
      }
      //console.log(countUniqueAns);
    });
    this.service.getAHT(this.publisher_id,start.getTime(), end.getTime(),url,[]).subscribe((res: Response) => {
      this.totalAvgCallsLoader = false;
      if(res['aht']['aht']){
        this.totalHandlingTime = Math.round((res['aht']['aht'])/60);
      }else{
        this.totalHandlingTime =0;
      }
    });
  })
  }
  publishername:any;
  buyername:any;
  allshowcdr(res) {
    this.showmethod1 = "loading"
    this.data = [];
   // console.log(res);
   //this.buyerservice.getAllBuyers().subscribe((r:Response)=>{

    
  // this.publisherservice.getManagePublisher().subscribe((response:Response)=>{
    // console.log(res);
    for (var i of res) {
      var diff = new Date(i.end).getTime() - new Date(i.start).getTime();
      var days = Math.floor(diff / (60 * 60 * 24 * 1000));
      var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
      var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
      var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
      //console.log(hours,minutes, seconds) ;
      
      // this.publishername=response['user'];
      // let name=this.publishername.find(pub=>pub.uid==i.pub_id).username
      // this.buyername=res['buyer'];
      // let buyer="No"
      // let namebuyer=this.buyername.find(buyer=>buyer.buyer_id==i.buyer_id)
      // if(namebuyer!=undefined){
      //   buyer=namebuyer.name;
        
      // }
      // console.log(namebuyer);
      var extnsn=''
      // console.log(i.dstchannel)
      if(i.dstchannel!=" " ){
        // console.log(i.dstchannel);
        var dstchannel=i.dstchannel.split('@')
      // console.log(dstchannel);
        var channel=dstchannel[0].split('/');
       // console.log(channel[0])
        extnsn=channel[1];
      }
     
          let cdr = {
            'date': i.start,
            'did': i.did,
            'destination': i.dst,
            'cid': i.src,
            'disposition': i.dstchannel!= ""?i.disposition:'MISSED CALL',
            // 'duration': i.duration,
            "callEnd":i.end,
            'duration': hours + ':' + minutes + ':' + seconds,
            'status': i.status,
            'record': i.record,
            'dupes': i.dupes,
            'hangby': i.hangby,
            'recordingfile':i.recordingfile,
            'camp_id':i.camp_id,
            'camp_name':i.camp_name,
            'pub_id':i.pub_id,
            'publisher_name':i.publisherName,
            //'buyer_name':buyer,
            'buyer_id':extnsn,
          }
          this.data.push(cdr)
    }

  
    //console.log(this.data);
    this.data.reverse();
    if (this.data == '') {
      this.showmethod1 = "no data";
    } else {
      this.showmethod1 = "";
    }
  //})
//})
    
  }
  
  
  status: boolean = false;
  clickFilter() {
    this.status = !this.status;
  }

  setting: boolean = false;
  clicksetting() {
    // alert();
    this.setting = !this.setting;
  }


  selectedFilter: string = '';

  filtr1: boolean = true;
  filtr2: boolean = true;
  filtr3: boolean = true;
  filtr4: boolean = true;
  filtr5: boolean = true;
  filtr6: boolean = true;
  filtr7: boolean = true;

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

        //this[statIndx] = false;
      }

    }

  }
  reset(){
 
      if (this.alluser.role != 'publisher') {
        this.publisherdropdown = "Select Publisher";
      }
  
    
      this.showcontent();
      // location.reload()

  }
  resetcampaign(){
    //console.log("sdg")
    this.campaigndropdown="Select Campaign"
    this.changecampaign()
  }
  resetpublisher(){
    this.publisherdropdown = "Select Publisher";
    this.changepublisher()
  }
  resetcollender(){
    this.ranges= {

      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    }
    this.selected= { start: moment(), end: moment() }
   // console.log(this.selected);
    this.showcontent()
  }
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
      this.statusSearch = '';
    }
    // if(num=='filtr2'){
    //   this.did='';
    // }
    this[num] = false;
  }
  submit() { 
    this.showmethod1="loading";
    this.totalCallsLoader=true;
    this.totalUniqCallsLoader=true;
    this.totalAvgCallsLoader=true;
    this.totalUniqAnsweredCallsLoader=true;

    let data='';
    if (this.alluser.role == 'publisher') {
      data='?pub_id='+this.alluser.uid
    }else if(this.alluser.role == 'admin'){
      if(this.publisherdropdown!='Select Publisher'&& this.publisherdropdown!=''){
        data='?pub_id='+this.alluser.uid
      }
    }else{
      data='';
    }
    
    this.buyerservice.getNumberByid(this.alluser.uid).subscribe((res: Response) => {
      this.buyer = res['buyerNumber'];
      
      this.buyernum=this.buyer.map(({ number }) => number).join(',')
      if(this.alluser.uid=='buyer'){
        data='?buyerNumber=['+this.buyernum+']'
      }
    //  console.log(this.selected);
    if (this.selected.startDate) {
      this.service.getTotalCalls(this.selected.startDate._d.getTime(), this.selected.endDate._d.getTime(),data).subscribe((res: Response) => {
        //this.showmethod1 = "loading"
        this.totalCallsLoader=false;
        this.totalUniqCallsLoader = false;
        this.totalUniqAnsweredCallsLoader = false;
        this.totalcalls = res['totalcalls'];
        var data=[];
        var countUniqueAns=0
       res['cdr'].map(({src,dstchannel,disposition})=>{
        var extnsn = ''
        if (dstchannel != " ") {
  
          var dstchannel = dstchannel.split('@')
  
          var channel = dstchannel[0].split('/');
  
          extnsn = channel[1];
        }
         
            let ciddata={
              src:src,
              disposition:dstchannel != "" ? disposition : 'MISSED CALL'
            }
            if (ciddata.disposition == "ANSWERED") {
              countUniqueAns=countUniqueAns+1
            }
            if(data.findIndex(data=>data.src==src)==-1){
           data.push(ciddata)
          }
         
        })
        this.totalUniqueCalls=data.length
        console.log(data);
        //this.totalUniqueAnsCalls=countUniqueAns;
        if (countUniqueAns <= 0) {
          this.totalUniqueAnsCalls = this.totalUniqueCalls
        } else {
          this.totalUniqueAnsCalls = (countUniqueAns - (this.totalcalls-this.totalUniqueCalls))
        }
        if (this.totalUniqueAnsCalls <= 0) {
          this.totalUniqueAnsCalls = this.totalUniqueCalls;
        }
        //console.log(countUniqueAns);
      });
      this.service.getAHT(this.publisher_id,this.selected.startDate._d.getTime(), this.selected.endDate._d.getTime(),data,[]).subscribe((res: Response) => {
        this.totalAvgCallsLoader = false;
        if(res['aht']['aht']){
          this.totalHandlingTime = Math.round((res['aht']['aht'])/60);
        }else{
          this.totalHandlingTime =0;
        }
      });
      
      // this.service.getTotalCalls(this.selected.startDate._d.getTime(), this.selected.endDate._d.getTime(),data).subscribe((res: Response) => {
      //   // console.log(res);
      //   //this.showmethod1 = "loading"
      //   this.totalCallsLoader=false;
      //   this.allshowcdr(res['cdr']);
      //   this.totalcalls = res['totalcalls'];
      // })
      // this.service.getAHT(this.publisher_id,this.selected.startDate._d.getTime(), this.selected.endDate._d.getTime(),data,[]).subscribe((res: Response) => {
      //   this.totalAvgCallsLoader=false;
      //   if(res['aht']['aht']){
      //     this.totalHandlingTime = Math.round((res['aht']['aht'])/60);
      //   }else{
      //     this.totalHandlingTime =0;
      //   }
      // });
      // this.service.getTotalUniqueAnsCalls(this.selected.startDate._d.getTime(), this.selected.endDate._d.getTime(),data).subscribe((res: Response) => {
      //   this.totalUniqCallsLoader=false;
      //   this.totalUniqueAnsCalls = res['totaluniqueansweredcalls'];
      // });
      // this.service.getUniqueCalls(this.selected.startDate._d.getTime(), this.selected.endDate._d.getTime(),data).subscribe((res: Response) => {
      //   this.totalUniqAnsweredCallsLoader=false;
      //   this.totalUniqueCalls = res['totaluniquecalls'];
      // });
    }else if(this.selected){
      this.service.getTotalCalls(this.selected.start._d.getTime(), this.selected.end._d.getTime(),data).subscribe((res: Response) => {
        // console.log(res);
        //this.showmethod1 = "loading"
        this.totalCallsLoader=false;
        this.allshowcdr(res['cdr']);
        this.totalcalls = res['totalcalls'];
      })
      this.service.getAHT(this.publisher_id,this.selected.start._d.getTime(), this.selected.end._d.getTime(),data,[]).subscribe((res: Response) => {
        this.totalAvgCallsLoader=false;
        if(res['aht']['aht']){
          this.totalHandlingTime = Math.round((res['aht']['aht'])/60);
        }else{
          this.totalHandlingTime =0;
        }
      });
      this.service.getTotalUniqueAnsCalls(this.selected.start._d.getTime(), this.selected.end._d.getTime(),data).subscribe((res: Response) => {
        this.totalUniqCallsLoader=false;
        this.totalUniqueAnsCalls = res['totaluniqueansweredcalls'];
      });
      this.service.getUniqueCalls(this.selected.start._d.getTime(), this.selected.end._d.getTime(),data).subscribe((res: Response) => {
        this.totalUniqAnsweredCallsLoader=false;
        this.totalUniqueCalls = res['totaluniquecalls'];
      });
    }
  });
    //console.log(this.selected.startDate._d.getTime());

  }

   playfor(path,date){
   
   // console.log(path);
 let latest_date =this.datepipe.transform(date, 'yyyy/MM/dd');
 let data=latest_date+'/'+path
    this.sideNavService.currentNameSubject.next(data)
    //  this.audioSources=[];
    // this.palyer=true;
    // let data={
    //   'src':'https://recordingsaws.s3.ap-south-1.amazonaws.com/2019/10/20/q-30000309-1189-20191020-073206-1571556725.218316.wav',
    //   type: 'audio/mp3',
    // }
    // this.audioSources.push(data);
   this.sideNavService.mplay()
   }
//   @ViewChild(PlyrComponent, Plyr)
//   plyr: PlyrComponent;
//   player: Plyr;
//  options = {
//     settings: ['captions', 'quality', 'speed'],
//     controls: [
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
// ],

// };

//   audioSources = [
//     // {
//     //   title:'Sound-1',
//     //   src: 'https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.mp3',
//     //   type: 'audio/mp3',
//     // },
//     // {
//     //   title:'Sound-2',
//     //   src: 'https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.ogg',
//     //   type: 'audio/ogg',
//     // },
//   ];

//   played(event: Plyr.PlyrEvent) {
//    // console.log('played', event);
//   }

//   play(): void {
//     this.player.play(); // or this.plyr.player.play()
//   }

//   pause(): void {
//     this.player.pause(); // or this.plyr.player.play()
//   }

//   stop(): void {
//     this.player.stop(); // or this.plyr.player.stop()
//   }

// restart():void{
// 	  this.player.restart();
// }
// playercross(){
//   this.palyer=false;
// }
exportAsXLSX():void {

  this.excelService.exportAsExcelFile(this.data, 'sample');
}
csvOptions = {
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalseparator: '.',
  showLabels: true,
  showTitle: true,
  title: 'Your Cdr Report :',
  useBom: true,
  noDownload: false,
  headers: ["Date", "Did", "Destination", "Cid","Disposition","duration","callEnd","status","record","dupes","hangby"]
};
downloadCSV(){
  //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
  new  AngularCsv(this.data, "CdrReport", this.csvOptions);
}

public chartHovered(e:any):void {
  //console.log(e);
}
public chartClicked(e:any):void {
  //console.log(e);
}
getaWeekly(){
  this.loader=true;
  this.colorvalue='weekly';
  this.color="#01314c"
  this.dservice.getReport(this.campaigndropdown,this.publisherdropdown).subscribe((res:Response)=>{
    this.loader=false;
    this.lineChartLabels=res['weekly']['week']
    this.lineChartData=res['weekly']['data']
   // console.log(this.lineChartData)

  })
 
}
getaHourly(){
  this.loader=true;
  this.colorvalue='hourly';
  this.color="#ffc36d";
  this.dservice.getHourlyReport(this.campaigndropdown,this.publisherdropdown).subscribe((res:Response)=>{
    this.loader=false;
    this.lineChartLabels=res['weekly']['week']
    this.lineChartData=res['weekly']['data']
    
  })
}
getaMonthly(){
  this.loader=true;
  this.colorvalue='monthly';
  this.color="#01314c"
  this.dservice.getMonthlyReport(this.campaigndropdown,this.publisherdropdown).subscribe((res:Response)=>{
    this.loader=false;
    this.lineChartLabels=res['monthly']['month']
    this.lineChartData=res['monthly']['data']
    
  })

}
changecampaign(){
  //console.log(this.colorvalue);
  
  if(this.colorvalue=='hourly'){
    this.getaHourly();
  }else if(this.colorvalue=='monthly'){
    this.getaMonthly()
  }else{
    this.getaWeekly();
  }
}
changepublisher(){
  this.submit();
  if(this.colorvalue=='hourly'){
    this.getaHourly();
  }else if(this.colorvalue=='monthly'){
    this.getaMonthly()
  }else{
    this.getaWeekly();
  }
}


}


