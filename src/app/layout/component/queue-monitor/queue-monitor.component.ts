import { Component, OnInit, OnDestroy } from '@angular/core';
import { ManageQueueService } from 'src/app/servies/user/manage-queue.service';
import { QueueMonitorService } from 'src/app/servies/queueMonitor/queue-monitor.service';
import { Select2OptionData } from 'ng-select2';
@Component({
  selector: 'app-queue-monitor',
  templateUrl: './queue-monitor.component.html',
  styleUrls: ['./queue-monitor.component.css']
})
export class QueueMonitorComponent implements OnInit, OnDestroy {
  public exampleData: Array<Select2OptionData>;
  // queueNumber="select Queue"
  data: any = []
  dataodCall: any
  queuelist: any=[];
  watingCall: any;
  nameWithStatus: any;
  setinter: any;
  id: any;
  alluser:any;
  newrole:any
  pubQueue:any;
  totalwatingCalls :number = 0;
  loadingStatus:any=false;
  route: any;
  constructor(public queue: ManageQueueService, public service: QueueMonitorService) { }
  QueueNumber: any = "Select Queue Number"
  ngOnInit() {

      this.alluser = JSON.parse(localStorage.getItem('username'));
      if(!this.alluser){
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        this.route.navigate(['login']);
      }

      if(this.alluser.role=='publisher' || this.alluser.role=="monitor"){
        
        this.queue.getQueueNumberByPubId(this.alluser.uid).subscribe((res: Response) => {
          this.newrole = res['queues']
          this.queuelist=[];
          this.newrole.map((newrole)=>{
  
            this.queue.getQueueNumberByQueueId(newrole.queue_id).subscribe((response: Response) => {
        
              this.pubQueue = response['queueNumber'];
              this.exampleData = this.pubQueue.map((src)=>{
                this.queuelist.push(src.number)
                let data = {
                  'id': src.number,
                  'text': src.number
                }
                return data;
              })
            })
  
           })
        })

        /*this.queue.getQueueNumberByPubId(this.alluser.uid).subscribe((res:Response)=>{
          this.queuelist=[];
          this.newrole=res['queues']
          for(var i of this.newrole){
            this.queue.getQueueNumberByQueueId(i.queue_id).subscribe((response:Response)=>{
 
                this.pubQueue=response['queueNumber'];
                for (var j of this.pubQueue){
                  let data={
                    'id':j.number,
                    'text':j.number,
                   
                  }
                  this.queuelist.push(data);
                }
                this.exampleData=this.queuelist;
                
            })
          }
        })*/

       
      }else{
        
        this.queue.postQueueNumberFreepbx().subscribe((res: Response) => {
          this.pubQueue = res;
          for (var j of this.pubQueue){
            let data={
              'id':j.extension,
              'text':j.extension,
             
            }
            this.queuelist.push(data);
          }
          this.exampleData=this.queuelist;
        });
      }
      
      
      // for(var i of )
      // if (this.alluser.role == 'publisher') {
      //   let data = {
      //     'publisher_name': publisher.fullname,
      //     'pub_id': publisher.uid,
      //   }
      //   this.dropdownpublisher.push(data);
      // }
      
    
    // if (this.QueueNumber != 'Select Queue Number') {
    //   this.calculation(this.QueueNumber);
    //   this.setinter = setInterval(() => {
        
    //     this.calculation(this.QueueNumber);
    //   }, 10000);
    // }

    ////console.log(this.QueueNumber);

    // this.data = [
    //   {'did': '18442693081', 'extension': '25432', 'dur': '00:12:35', 'caller': '8965431', 'campaign': 'FlightBooking'},
    //   {'did': '18882080517', 'extension': '14321', 'dur': '00:22:58', 'caller': '7654903', 'campaign': 'FlightBooking'},
    //   {'did': '18444713005', 'extension': '15363', 'dur': '00:10:44', 'caller': '6782548', 'campaign': 'FlightBooking'},
    //   {'did': '18882633612', 'extension': '23632', 'dur': '00:14:47', 'caller': '6849274', 'campaign': 'FlightBooking'},
    //   {'did': '18883242320', 'extension': '25431', 'dur': '00:25:28', 'caller': '6714658', 'campaign': 'FlightBooking'}
    //    ]

  }

  waitingcallfun(value) {
    this.service.getAllWatingCall(value).subscribe((res: Response) => {
      this.watingCall = res;
      this.totalwatingCalls = this.watingCall?this.watingCall.length:0;
    })
  }

  loggIn = 0
  avail = 0
  lhold = 0
  hold = 0
  oncall = 0
  unavail = 0

  getAllDetails(value) {
    this.data=[];
    
    if(value !='Select Queue Number'){
      this.loadingStatus=true;
      
      this.calculation(this.QueueNumber)
      
    this.setinter = setInterval(() => {
      this.calculation(this.QueueNumber);
      this.waitingcallfun(this.QueueNumber)
    }, 10000);
    // this.id = setInterval(() => {
     
    // }, 10000);
    }
    


  }

  calculation(value) {
     
    this.service.getallmonitor(value).subscribe((res: Response) => {
      // //console.log(res)
      this.loadingStatus=false;
    this.loggIn = res['extension_details']['login'],
    this.avail = res['extension_details']['avail'],
    this.lhold = res['extension_details']['lhold'],
    this.hold = res['extension_details']['hold'],
    this.oncall = res['extension_details']['oncall'],
    this.unavail = res['extension_details']['unavail'];
    this.dataodCall = res['extension_details']['call_details']
    this.nameWithStatus = res['extensiondetail'];
      ////console.log(this.data);
      if (this.nameWithStatus != '') {
        if (this.data != '') {
          ////console.log(this.data);
          for (var notcall of this.data) {
            var datapart = this.nameWithStatus.findIndex(data => data.name.replace(/\s/g, "") == notcall.ConnectedLineNum )
            ////console.log(notcall.ConnectedLineNum +datapart);
            if (datapart == -1) {
              this.data.splice(datapart, 1);
            }
            //console.log(this.data);
          }
          //console.log(this.data);
        }
        for (var allcoller of this.nameWithStatus) {
          let Statusvalue = ''
          if (allcoller.status == 1) {
            Statusvalue = 'Available'
          } else if (allcoller.status == 2) {
            Statusvalue = 'Oncall'
          }
          else if (allcoller.status == 3) {
            Statusvalue = 'Busy'
          }
          else if (allcoller.status == 6) {
            Statusvalue = 'ringing'
          }
          else {
            Statusvalue = 'Other'
          }
          if (allcoller.name.replace(/\s/g, "") != '0' && allcoller.name.replace(/\s/g, "") != '1') {
            if (this.dataodCall) {
             // //console.log(this.dataodCall);
             //console.log(allcoller.name.replace(/\s/g, ""))
              if (this.data == '') {
                var find = this.dataodCall.find(data => data.ConnectedLineNum == allcoller.name.replace(/\s/g, ""));

                if (find != undefined && find != '') {
                  let calldetails = {
                    'status': Statusvalue,
                    'ConnectedLineNum': find.ConnectedLineNum.replace(/\s/g, ""),
                    'did': find.did,
                    'CallerIDNum': find.CallerIDnum,
                    'camp_name': '',
                    'duration': find.duration,
                  }
                  this.data.push(calldetails);
                } else {
                  var callduration ='';
                  if (allcoller.LastCall.replace(/\s/g, "") == 0) {
                    callduration = "No Call"

                  }else{
                    callduration = this.getAllTime(allcoller.LastCall)
                  }
                  let calldetails = {
                    'status': Statusvalue,
                    'ConnectedLineNum': allcoller.name.replace(/\s/g, ""),
                    'did': '',
                    'CallerIDNum': '',
                    'camp_name': '',
                    'duration': callduration,
                  }
                  this.data.push(calldetails);
                }
               //console.log(this.data);
              } else {
                
                var find = this.dataodCall.find(data => data.ConnectedLineNum == allcoller.name.replace(/\s/g, ""));
                //console.log(allcoller.name.replace(/\s/g, ""));
                if (find != undefined && find != '') {
                  //console.log(find);
                  var new1 = this.data.findIndex(data => data.ConnectedLineNum == allcoller.name.replace(/\s/g, ""))
                  //console.log(new1+" "+allcoller.name.replace(/\s/g, ""));
                  if (new1 == -1) {
                    let calldetails = {
                      'status': Statusvalue,
                      'ConnectedLineNum': find.ConnectedLineNum,
                      'did': find.did,
                      'CallerIDNum': find.CallerIDNum,
                      'camp_name': '',
                      'duration': find.duration,
                    }
                    this.data.push(calldetails);
                  } else {
                    //console.log(find);
                   // //console.log(this.data.findIndex(data => data.ConnectedLineNum == find.ConnectedLineNum));
                    let calldetails = {
                      'status': Statusvalue,
                      'ConnectedLineNum': find.ConnectedLineNum,
                      'did': find.did,
                      'CallerIDNum': find.CallerIDNum,
                      'camp_name': '',
                      'duration': find.duration,
                    }
                    // //console.log(calldetails);
                    this.data.splice(new1, 1, calldetails);
                  }

                } else {
                  var find1 = this.data.findIndex(data => data.ConnectedLineNum == allcoller.name.replace(/\s/g, ""));
                  if (find1 != -1) {
                    var callduration ='';
                  if (allcoller.LastCall.replace(/\s/g, "") == 0) {
                    callduration = "No Call"

                  }else{
                    callduration = this.getAllTime(allcoller.LastCall)
                  }
                    let calldetails = {
                      'status': Statusvalue,
                      'ConnectedLineNum': allcoller.name.replace(/\s/g, ""),
                      'did': '',
                      'CallerIDNum': '',
                      'camp_name': '',
                      'duration': callduration,
                    }
                    this.data.splice(find1, 1, calldetails);
                  } else {
                    let calldetails = {
                      'status': Statusvalue,
                      'ConnectedLineNum': allcoller.name.replace(/\s/g, ""),
                      'did': '',
                      'CallerIDNum': '',
                      'camp_name': '',
                      'duration': callduration,
                    }
                    this.data.push(calldetails);
                  }

                }
              }
             
              // these code continue

            } else {
              // //console.log(this.data)  
              var start = new Date()
              start.setHours(0, 0, 0, 0);
              if (this.data != '') {
                var index = this.data.findIndex(showdata => showdata.ConnectedLineNum == allcoller.name.replace(/\s/g, ""));
                if (index == -1) {
                  var callduration ='';
                  if (allcoller.LastCall.replace(/\s/g, "") == 0) {
                    callduration = "No Call"

                  }else{
                    callduration = this.getAllTime(allcoller.LastCall)
                  }
                  // this.getFormathours(start.getTime() - new Date(allcoller.LastCall.replace(/\s/g, "")).getTime())
                  let calldetails = {
                    'status': Statusvalue,
                    'ConnectedLineNum': allcoller.name.replace(/\s/g, ""),
                    'did': '',
                    'CallerIDNum': '',
                    'camp_name': '',
                    'duration': callduration,
                  }
                  this.data.push(calldetails);
                } else {
                  var callduration ='';
                  if (allcoller.LastCall.replace(/\s/g, "") == 0) {
                    callduration = "No Call"

                  }else{
                    callduration = this.getAllTime(allcoller.LastCall)
                  }
                  let calldetails = {
                    'status': Statusvalue,
                    'ConnectedLineNum': allcoller.name.replace(/\s/g, ""),
                    'did': '',
                    'CallerIDNum': '',
                    'camp_name': '',
                    'duration': callduration,
                  }
                  this.data.splice(index, 1, calldetails);  

                }

              } else {
                //  //console.log("ds")
                // this.getFormathours(start.getTime() - allcoller.LastCall.replace(/\s/g, ""))
                var callduration ='';
                  if (allcoller.LastCall.replace(/\s/g, "") == 0) {
                    callduration = "No Call"

                  }else{
                    callduration = this.getAllTime(allcoller.LastCall)
                  }
                let calldetails = {
                  'status': Statusvalue,
                  'ConnectedLineNum': allcoller.name.replace(/\s/g, ""),
                  'did': '',
                  'CallerIDNum': '',
                  'camp_name': '',
                  'duration': callduration,
                }
                this.data.push(calldetails);
              }



            }
          }
        }


      }
    })
    //console.log(this.data)
  }
  findIndexToUpdate(newItem) {
    return newItem.id === this;
  }
  ngOnDestroy() {
    clearInterval(this.setinter);
    clearInterval(this.id);
    
  }
  getAllTime(date){
      console.log("mydate:"+date);
      console.log("date:"+new Date());

      var usaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
      //var usaTime1 = new Date(usaTime);
      var diff = new Date(usaTime).getTime()/1000-date.replace(/\s/g, "");
      var days = Math.floor(diff / (60 * 60 * 24 * 1000));
      var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
      var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
      var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
      if(hours ==0 ){
      var time=minutes+" min "+seconds+" sec"
      }else{
      var time=hours+" Hour " +minutes+" min "+seconds+" sec"
      }

      return time
  }

  // queuelist = [
  //   {'queue': '324GeekCalls'},
  //   {'queue': '336prishitest_camp56'},
  //   {'queue': '3418Travel'},
  //   {'queue': '3618WR'},
  //   {'queue': '3718TS'},
  //   {'queue': '3918UnitedPhoneNumbers'},
  //   {'queue': '4_5_test_test'},
  //   {'queue': '426test11'},
  //   {'queue': '436test12'}
  //       ]
  status: boolean = false;
  clickFilter() {
    // alert();
    this.status = !this.status;
  }
  getFormathours(input) {
    var totalHours, totalMinutes, totalSeconds, hours, minutes, seconds, result = '';
    totalSeconds = input / 1000;
    totalMinutes = totalSeconds / 60;
    totalHours = totalMinutes / 60;

    seconds = Math.floor(totalSeconds) % 60;
    minutes = Math.floor(totalMinutes) % 60;
    hours = Math.floor(totalHours) % 60;

    //console.log(hours + ' : ' + minutes + ' : ' + seconds);
    if (hours !== 0) {
      result += hours + ' hr:';

      if (minutes.toString().length == 1) {
        minutes = '0' + minutes;
      }
    }

    result += minutes + ' min';

    if (seconds.toString().length == 1) {
      seconds = '0' + seconds;
    }

    result += seconds;
    //console.log(result);
    return result;
  }
  resetQueue(){
    this.ngOnDestroy()
    this.QueueNumber='Select Queue Number'
    this.data=[];
    this.loggIn=0;
    this.avail=0;
    this.totalwatingCalls=0;
    this.hold=0;
    this.oncall=0;
  }
}
