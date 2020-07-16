import { Component, OnInit, ViewChild } from '@angular/core';

import { ServiceService } from '../../services/service.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LiveService } from 'src/app/servies/live.service';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  complete:number=0;
  totalcalls:number=0;
  constructor(public sideNavService: ServiceService,public route:Router,public service:LiveService,private titleService:Title) {
    this.titleService.setTitle("RouteCent | Dashboard");
   }
  email:any;
  name:any;
  alluser:any;
  isshow=false;
  id: any;
  public popoverTitle: string = 'Title';
  public popoverMessage: string = 'Are you really sure you want to do this?';
  public popoverClass: string = 'custompop';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
  livecallShow=true
  collapseNnav = true;
  ngOnInit() {
    this.alluser=JSON.parse(localStorage.getItem('username'))
    if(!this.alluser){
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      this.route.navigate(['login']);
    }
   if(this.alluser.role=='publisher' || this.alluser.role == 'admin'){
		this.isshow=true;
	}
    this.email=this.alluser.username;
    this.name=this.alluser.name
    if (this.alluser.role == 'monitor' ) {
      this.livecallShow=false;
    }else{
      this.livedata();
    this.id = setInterval(() => {
        this.livedata(); 
    }, 10000);
    }

    if (window.screen.width < 767) { // 768px portrait
      this.collapseNnav = false;
      // alert();
    }
  }

  ngOnDestroy() {
    clearInterval(this.id);
  }

  livedata(){
    let data='';
    if(this.alluser.role=='publisher'){
      data=`?pub_id=`+this.alluser.uid
    }else{
      data='';
    }
    this.service.getComplete(data).subscribe((res:Response)=>{
      this.complete=res['totalcalls'];
      //console.log(this.complete)
    })
    this.service.getLive(data).subscribe((res:Response)=>{
      this.totalcalls=res['total'];
    })
  }
  logout() {
    this.route.navigate(['login']);
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  }

  
  mobnav(){
    this.collapseNnav = !this.collapseNnav;
  }

}
