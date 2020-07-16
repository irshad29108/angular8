import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-manage-audit-profile',
  templateUrl: './manage-audit-profile.component.html',
  styleUrls: ['./manage-audit-profile.component.css']
})
export class ManageAuditProfileComponent implements OnInit {

  public data : any

  
  selected: any;
  alwaysShowCalendars: boolean;
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
  
  isInvalidDate = (m: moment.Moment) =>  {
    return this.invalidDates.some(d => d.isSame(m, 'day') )
  }
  constructor() { 
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
  	 this.data = [

  ]
  }

 status: boolean = false;
clickFilter(){
  // alert();
    this.status = !this.status;       
}
 add: boolean = false;
clickadd(){
  // alert();
    this.add = !this.add;       
}



selectedFilter: string = '';

filtr1: boolean = false;
filtr2: boolean = false;
filtr3: boolean = false;
filtr4: boolean = false;


selectChangeFilter (event: any) {
  //update the ui
  let optlent = event.target.options.length;
  let text = event.target.options.selectedIndex;
  this.selectedFilter = event.target.value;

  for(let i =1; i < optlent; i++){
    // console.log(this.fliterList[i-1]);
    let statIndx = "filtr"+i;
    
    if(i == text){
      console.log(statIndx);
      this[statIndx] = true;
    }else{
     
       this[statIndx] = false;
    }
  }

}

}
