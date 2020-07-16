import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  hideSideNav: boolean = false;
  
  constructor() { }

  toggleSideNav(): void {
    this.hideSideNav = !this.hideSideNav;
  }
  
mplayer: boolean = false;
closePlayer(){
  // alert();
  // console.log("dsg")
    this.mplayer = !this.mplayer;  
}
currentNameSubject = new BehaviorSubject('');

mplay() {
  
  if(this.mplayer == true){
   
   
  }else{
  this.closePlayer()
  }
}


}
