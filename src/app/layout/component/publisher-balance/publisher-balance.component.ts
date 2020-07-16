import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-publisher-balance',
  templateUrl: './publisher-balance.component.html',
  styleUrls: ['./publisher-balance.component.css']
})
export class PublisherBalanceComponent implements OnInit {

  public data : any
    
    selected: any;
    alwaysShowCalendars: boolean;
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
    
    constructor() {
      this.alwaysShowCalendars = true;
    }
 


  ngOnInit() {
  	 this.data = [
    {'name':'Anil', 'date': 'Jun 30 2019', 'campaign': 'AntiVirusTechSupport', 'totalcall': '56', 'payablecall': '43', 'callprice': '600', 'payableamount': '32000', 'status':'delay'},
    {'name':'Sunil', 'date': 'Jul 18 2019', 'campaign': 'AntiVirusTechSupport', 'totalcall': '34', 'payablecall': '30', 'callprice': '1600', 'payableamount': '48000', 'status':'active'},
    {'name':'Alok', 'date': 'Jul 15 2019', 'campaign': 'Bitdefender', 'totalcall': '64', 'payablecall': '55', 'callprice': '800', 'payableamount': '40000', 'status':'active'},
    {'name':'Tinku', 'date': 'Jul 24 2019', 'campaign': 'AirLinesPhoneNumber', 'totalcall': '24', 'payablecall': '20', 'callprice': '1700', 'payableamount': '35000', 'status':'active'},
    {'name':'Alex', 'date': 'Aug 20 2019', 'campaign': 'AUS-Antivirus', 'totalcall': '47', 'payablecall': '40', 'callprice': '1200', 'payableamount': '48000', 'status':'active'},
    {'name':'Nipun', 'date': 'Jul 10 2019', 'campaign': 'AntiVirusTechSupport', 'totalcall': '84', 'payablecall': '70', 'callprice': '900', 'payableamount': '63000', 'status':'active'},
    
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
 setting: boolean = false;
clicksetting(){
  // alert();
    this.setting = !this.setting;       
}
queue: boolean = false;
clickqueue(){
  // alert();
    this.queue = !this.queue;       
}
addbuyer: boolean = false;
clickbuyer(){
  // alert();
    this.addbuyer = !this.addbuyer;       
}


}
