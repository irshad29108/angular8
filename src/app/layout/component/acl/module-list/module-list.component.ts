import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.css']
})
export class ModuleListComponent implements OnInit {
  public data : any;

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
  
    constructor() { }
  
    ngOnInit() {
       this.data = [
      {'name':'Anil', 'address': '7340 Lee Hwy, Falls Church, VA 22046', 'recording': 'enable', 'queuecdr': 'enable', 'email' :'devtyagi9873@gmail.com', 'contact' :'9873484727', 'date' :'2019-01-05 07:39:27', 'cdr': 'enable', 'outboundcdr': 'enable', 'status':'enable'},
      {'name':'Anil', 'address' :'7340 Lee Hwy, Falls Church, VA 22046', 'recording': 'disable', 'queuecdr': 'enable', 'email' :'devtyagi9873@gmail.com', 'contact' :'9873484738', 'date' :'2019-01-05 07:39:38', 'cdr': 'enable', 'outboundcdr': 'enable', 'status':'enable'},
      {'name':'Sunil', 'address' :'7340 Lee Hwy, Falls Church, VA 22046', 'recording': 'disable', 'queuecdr': 'enable', 'email' :'devtyagi9873@gmail.com', 'contact' :'9873484744', 'date' :'2019-01-05 07:39:44', 'cdr': 'enable', 'outboundcdr': 'enable', 'status':'enable'},
      {'name':'Alok', 'address' :'New Delhi, India', 'recording': 'disable', 'queuecdr': 'enable', 'email' :'devtyagi9873@gmail.com', 'contact' :'9873484727', 'date' :'2019-01-05 07:39:27', 'cdr': 'enable', 'outboundcdr': 'enable', 'status':'enable'},
      {'name':'Tinku', 'address' :'New Delhi, India', 'recording': 'enable', 'queuecdr': 'enable', 'email' :'devtyagi9873@gmail.com', 'contact' :'9873484745', 'date' :'2019-01-05 07:39:45', 'cdr': 'enable', 'outboundcdr': 'enable', 'status':'enable'},
      {'name':'XYZ', 'address' :'7340 Lee Hwy, Falls Church, VA 22046', 'recording': 'enable', 'queuecdr': 'enable', 'email' :'devtyagi9873@gmail.com', 'contact' :'9873484730', 'date' :'2019-01-05 07:39:30', 'cdr': 'enable', 'outboundcdr': 'enable', 'status':'enable'},
      {'name':'asas', 'address' :'7340 Lee Hwy, Falls Church, VA 22046', 'recording': 'enable', 'queuecdr': 'enable', 'email' :'devtyagi9873@gmail.com', 'contact' :'9873484729', 'date' :'2019-01-05 07:39:29', 'cdr': 'enable', 'outboundcdr': 'enable', 'status':'enable'},
      {'name':'erer', 'address' :'New Delhi, India', 'recording': 'disable', 'queuecdr': 'enable', 'email' :'devtyagi9873@gmail.com', 'contact' :'9873484724', 'date' :'2019-01-05 07:39:24', 'cdr': 'enable', 'outboundcdr': 'enable', 'status':'enable'},
      {'name':'jhjh', 'address' :'7340 Lee Hwy, Falls Church, VA 22046', 'recording': 'disable', 'queuecdr': 'enable', 'email' :'devtyagi9873@gmail.com', 'contact' :'9873484733', 'date' :'2019-01-05 07:39:33', 'cdr': 'enable', 'outboundcdr': 'enable', 'status':'enable' }
    ]
    }
  
    addmodule: boolean = false;
  addnewmodule(){
    // alert();
      this.addmodule = !this.addmodule;       
  }

}
