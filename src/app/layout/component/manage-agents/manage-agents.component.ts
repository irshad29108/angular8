import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-agents',
  templateUrl: './manage-agents.component.html',
  styleUrls: ['./manage-agents.component.css']
})
export class ManageAgentsComponent implements OnInit {

public data : any

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
buyernumber: boolean = false;
managenumber(){
  // alert();
    this.buyernumber = !this.buyernumber;       
}
setpassword: boolean = false;
setPassword(){
  // alert();
    this.setpassword = !this.setpassword;       
}

}
