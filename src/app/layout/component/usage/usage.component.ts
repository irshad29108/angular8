import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UsageService } from 'src/app/servies/usage/usage.service';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css']
})
export class UsageComponent implements OnInit {

  public data : any
    showmethod1: any;
    selected: any;
    alluser:any;
    selectedFilter: string = '';
    filtr1: boolean = false;
    alwaysShowCalendars: boolean;
    did:any;
    ranges: any = {
      
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
    invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
    
    isInvalidDate = (m: moment.Moment) =>  {
      return this.invalidDates.some(d => d.isSame(m, 'day') )
    }
    
    constructor(public service:UsageService) {
      this.alwaysShowCalendars = true;
    }

  ngOnInit() {
    this.alluser = JSON.parse(localStorage.getItem('username'));
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
   
      this.allShowData(start.getTime(),end.getTime())
   
    
  
  }
  submit(){
    this.showmethod1 = "loading"
    if (this.selected.startDate) {
      this.allShowData(this.selected.startDate._d.getTime(), this.selected.endDate._d.getTime())
    }
  }

  status: boolean = false;
  clickFilter(){
    // alert();
      this.status = !this.status;       
  }
  allShowData(startDate,endDate){
    let id=''
    if (this.alluser.role == 'publisher') {
      id=this.alluser.uid
    }
    this.service.getUsageModule(id,startDate,endDate).subscribe((res:Response)=>{
      // console.log(res);
      this.data=res['usageReport'];
      this.data.reverse();
      if (this.data == '') {
        this.showmethod1 = "no data";
      } else {
        this.showmethod1 = "";
      }
    })
   
    

  }
  // closefiltr(num) {
  //   if (num == 'filtr1') {
  //     this.did = '';
  //   }
  //   this[num] = false;
  // }
  


}
