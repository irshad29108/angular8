import { Component, OnInit, EventEmitter } from '@angular/core';
// import { MorrisJsModule } from 'angular-morris-js';
import { ChartDataSets, ChartOptions} from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ISlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import * as moment from 'moment';
import { RealtimeService } from 'src/app/servies/realtime.service';
import { CdrService } from 'src/app/servies/cdr/cdr.service';
import { DashboardService } from 'src/app/servies/user/dashboard/dashboard.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalCallsLoader:boolean=true;
  totalUniqCallsLoader:boolean=true;
  totalAvgCallsLoader:boolean=true;
  totalUniqAnsweredCallsLoader:boolean=true;

  isbuyer:boolean;
  color='#ffc36d';
  public data : any 
  selected: any;
  loader:boolean=false
  alwaysShowCalendars: boolean;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
    
  }
  currentDate: any = {start: moment(), end: moment()}


  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
  
  isInvalidDate = (m: moment.Moment) =>  {
    return this.invalidDates.some(d => d.isSame(m, 'day') )
  }

  
  constructor(public service: RealtimeService,public cdrservice:CdrService,public dservice:DashboardService) {
    this.alwaysShowCalendars = true;
  }

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
  public lineChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
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

    public chartClicked1(e:any):void {
       //console.log(e);
    }
    
    public chartHovered1(e:any):void {
      //console.log(e);
    }
    public chartClicked(e:any):void {
      //console.log(e);
   }
   
   public chartHovered(e:any):void {
     //console.log(e);
   }

    status: boolean = false;
    clickFilter(){
      // alert();
        this.status = !this.status;       
    }
  
  opts: ISlimScrollOptions;
  scrollEvents: EventEmitter<SlimScrollEvent>;
  alluser:any;
  totalcalls:any=0;
  apiEndPont:any='';
  apiEndPont1:any='';
  totalHandlingTime:any=0;
  totalUniqueAnsCalls:any=0;
  totalUniqueCalls:any=0;
  isMonitor:boolean=false;
  publisher_id:any;
  
    ngOnInit() {
      this.getStyle('Hourly');
      this.alluser = JSON.parse(localStorage.getItem('username'));
      let data='';
      if(this.alluser.role=='buyer'){
        this.isbuyer=false;
      }else{
        this.isbuyer=true;
      }
      if (this.alluser.role == 'publisher' ) {
        this.apiEndPont='?pub_id='+this.alluser.uid
        this.apiEndPont1=this.alluser.uid;
      }
      if (this.alluser.role == 'monitor' ) {
        this.isMonitor=true;
      }
      // this.dservice.getReport(this.apiEndPont).subscribe((res:Response)=>{
      //   //console.log(res);
      //   this.lineChartLabels=res['weekly']['week']
      //   this.lineChartData=res['weekly']['data']
      //   console.log(this.lineChartData)

      // })
      this.loader=true;
      this.dservice.getHourlyReport('',this.apiEndPont1).subscribe((res:Response)=>{
        this.loader=false;
        this.lineChartLabels=res['weekly']['week']
        this.lineChartData=res['weekly']['data']
        
      })
      var start = new Date();
      start.setHours(0, 0, 0, 0);
      var end = new Date();
      end.setHours(23, 59, 59, 999);
      // console.log(end.getTime());


      if(this.alluser.role == 'publisher'){
        this.publisher_id=this.publisherdropdown
      }else if(this.alluser.role == 'monitor'){
        this.publisher_id=-1;
      }else{
        this.publisher_id="";
      }

      
  
      this.cdrservice.getTotalCalls(start.getTime(), end.getTime(),this.apiEndPont).subscribe((res: Response) => {
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
      this.cdrservice.getAHT(this.publisher_id,start.getTime(), end.getTime(),this.apiEndPont,[]).subscribe((res: Response) => {
        this.totalAvgCallsLoader = false;
        if(res['aht']['aht']){
          this.totalHandlingTime = Math.round((res['aht']['aht'])/60);
        }else{
          this.totalHandlingTime =0;
        }
      });
      // this.cdrservice.getTotalUniqueAnsCalls(start.getTime(), end.getTime(),this.apiEndPont).subscribe((res: Response) => {
      //   this.totalUniqCallsLoader = false;
      //   this.totalUniqueAnsCalls = res['totaluniqueansweredcalls'];
      // });
      // this.cdrservice.getUniqueCalls(start.getTime(), end.getTime(),this.apiEndPont).subscribe((res: Response) => {
      //   this.totalUniqAnsweredCallsLoader = false;
      //   this.totalUniqueCalls = res['totaluniquecalls'];
      // });
      
      this.allRealtime()
  this.scrollEvents = new EventEmitter<SlimScrollEvent>();
    this.opts = {
      position: "right", // left | right
      barBackground: "red", // #C9C9C9
      barOpacity: "0.8", // 0.8
      barWidth: "1", // 10
      barBorderRadius: "10", // 20
      barMargin: "0", // 0
      gridBackground: "#d9d9d9", // #D9D9D9
      gridOpacity: "1", // 1
      gridWidth: "2", // 2
      gridBorderRadius: "10", // 20
      gridMargin: "0", // 0
      alwaysVisible: true, // true
      visibleTimeout: 1000, // 1000
      //scrollSensitivity: 1, // 1
    }
  
    }
    publisherdropdown:any;
    data1:any=[];
    showmethod=""
    token:any;
    allRealtime() {
      this.data=[];
    this.showmethod="loading"
    if(this.alluser.role!='admin'){
      this.token={'token':'r3ByrH3W1U01dKvL','pub_id':this.alluser.uid}
    }else{
      this.token={'token':'r3ByrH3W1U01dKvL'}
    }
      if (this.alluser.role == 'publisher') {
        this.publisherdropdown = this.alluser.uid;
        this.service.getAllRealTime(this.token).subscribe((res: Response) => {
          this.data1 = res;
          if(this.data1 !='' && this.data1!=null){
            for (var i of this.data1) {
              if (this.publisherdropdown == i.pub_id) {
                let d = {
                  'from_did': i.from_did.replace('\r', ''),
                  'channel': i.channel.replace('\r', ''),
                  'talking_to': i.talking_to.replace('\r', ''),
                  'buyer_number': i.buyer_number.replace('\r', ''),
                  'queue': i.queue.replace('\r', ''),
                  'duration': i.duration.replace('\r', ''),
                  'camp_id': i.camp_id.replace('\r', ''),
    
                }
                this.data.push(d);
              }
            }
          }
          
        })
      } else {
        this.service.getAllRealTime(this.token).subscribe((res: Response) => {
          this.data1 = res;
          if(this.data1 !='' && this.data1!=null){
         
          for (var i of this.data1) {
            let d = {
              'from_did': i.from_did.replace('\r', ''),
              'channel': i.channel.replace('\r', ''),
              'talking_to': i.talking_to.replace('\r', ''),
              'buyer_number': i.buyer_number.replace('\r', ''),
              'queue': i.queue.replace('\r', ''),
              'duration': i.duration.replace('\r', ''),
              'camp_id': i.camp_id.replace('\r', ''),
            }
            this.data.push(d);
          }
        }
        })
      }
      if(this.data==''){
        this.showmethod="no data";
      }else{
        this.showmethod="";
      }
  
    }

    getStyle(data){
      console.log(data)
      if (data == 'Hourly') {
        
        return "#ffc36d";
    } else{
      return "#01314c";
    }
     


    }
    getaWeekly(){
      this.loader=true;
      this.color="#01314c"
      this.dservice.getReport('',this.apiEndPont1).subscribe((res:Response)=>{
        //console.log(res);
        this.loader=false;
        this.lineChartLabels=res['weekly']['week']
        this.lineChartData=res['weekly']['data']
        console.log(this.lineChartData)

      })
     
    }
    getaHourly(){
      this.loader=true
      this.color="#ffc36d";
      this.dservice.getHourlyReport('',this.apiEndPont1).subscribe((res:Response)=>{
        this.loader=false
        this.lineChartLabels=res['weekly']['week']
        this.lineChartData=res['weekly']['data']
        
      })
    }
    getaMonthly(){
      this.loader=true;
      this.color="#01314c"
      this.dservice.getMonthlyReport('',this.apiEndPont1).subscribe((res:Response)=>{
        this.loader=false;
        this.lineChartLabels=res['monthly']['month']
        this.lineChartData=res['monthly']['data']
        
      })
    
    }
  
}
