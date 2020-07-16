import { Component, OnInit, ViewChild,Input } from '@angular/core';
import Plyr from 'plyr';
import { PlyrComponent } from 'ngx-plyr';
import { ServiceService } from '../../services/service.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
@Component({
  selector: 'app-audioplayer',
  templateUrl: './audioplayer.component.html',
  styleUrls: ['./audioplayer.component.css']
})
export class AudioplayerComponent implements OnInit {
  
  @Input() audioSources:string;
  msbapDisplayTitle = false; 
  datashow=false;
  msbapDisplayVolumeControls = true; 
  msbapTitle:any
  msbapAudioUrl:any;
  playershow:any=false;
  // @ViewChild(PlyrComponent, Plyr)
  plyr: PlyrComponent;
  player: Plyr;
 options = {
    settings: ['captions', 'quality', 'speed'],
    controls: [
    'play-large', 
    'restart',
    'rewind', 
    'play', 
    'fast-forward',
    'progress', 
    'current-time', 
    'duration', 
    'mute', 
    'volume', 
    'captions', 
    'settings', 
    'pip', 
    'airplay', 
    'download', 
    'fullscreen', 
],

};
  datavalue:any
  constructor(public sideNavService: ServiceService,public st:DomSanitizer) {
    sideNavService.mplayer=false;
    sideNavService.currentNameSubject.subscribe(val=>{
     // this.sideNavService.mplayer=false;
      
      if(val!=''){
        this.datavalue=''
        if(this.datavalue!=val){
          this.datavalue=val;
          // console.log("dfg");

          this.playershow=false;
          setTimeout( ()=>{
            this.playershow=true;
            this.audioSources=this.datavalue;
           }, 1000);
         
        }
       
        
        // setInterval(() => {
        //   this.sideNavService.mplayer=true;
        // }, 1000);
       
        
        // this.msbapTitle = 'Audio Title';
        // this.msbapAudioUrl = 'https://s3.ap-south-1.amazonaws.com/recordingsaws/2019/10/22/q-900-4062072326-20191022-141427-1571771667.226034.wav'; 
        //  this.audioSources= [
        //    {
        //      title:'Sound-1',
        //      src: 'https:s3.ap-south-1.amazonaws.com/recordingsaws/2019/10/22/q-900-4062072326-20191022-141427-1571771667.226034.wav',
        //      type: 'audio/wav',
        //    },
        //   ]
        
      }
     
    })
   }

  ngOnInit() {
    
   
  }


  

  // audioSources = [
  //   {
  //     title:'Sound-1',
  //     src: 'https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.mp3',
  //     type: 'audio/mp3',
  //   },
  //   {
  //     title:'Sound-2',
  //     src: 'https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.ogg',
  //     type: 'audio/ogg',
  //   },
  // ];

  played(event: Plyr.PlyrEvent) {
    //console.log('played', event);
  }

  play(): void {
    this.player.play(); // or this.plyr.player.play()
  }

  pause(): void {
    this.player.pause(); // or this.plyr.player.play()
  }

  stop(): void {
    this.player.stop(); // or this.plyr.player.stop()
  }

restart():void{
	  this.player.restart();
}
photoURL(url) {
  return this.st.bypassSecurityTrustUrl(url);
}


}
