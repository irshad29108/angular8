import { Component, OnInit,OnDestroy } from '@angular/core';
import { RealtimeService } from 'src/app/servies/realtime.service';
import { interval } from 'rxjs';
import { ManageBuyersService } from 'src/app/servies/user/manage-buyers.service';
import { DashboardService } from 'src/app/servies/user/dashboard/dashboard.service';
import { LiveService } from 'src/app/servies/live.service';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.css']
})
export class RealtimeComponent implements OnInit{

  data: any = [];
  data1: any;
  publisherdropdown: any;
  public popoverTitle: string = 'Popover title';
  public popoverMessage: string = 'Are you really sure you want to hangup Call?';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
  public popoverClass: string = 'custompop';
  buyernum: any;
  buyerpush:any=[];
  constructor(public buyerservice:ManageBuyersService,public service: RealtimeService,public dashbord:LiveService,public route:Router) { }
  alluser: any;
  id: any;
  Counter: any;
  buyer:any;
  statuscode:any;
  messageheader: any;
  messageheadererror: any;
  loading:boolean = true;
  setIntervalId:any;
  buyers:any;
  buyerNumbers:any=[];
  showmethod:any;
  callHangup(channel){

    if(channel){
      this.loading = true;

      this.service.getcallHangup(channel).subscribe((res: Response) => {
        
        this.statuscode = res['statusCode'];

        if (this.statuscode == '200') {

          this.messageheader = "Call hase been Hangup";
          setTimeout(() => {
            this.messageheader = "";

          }, 5000);

          this.allRealtime();

        } else {

          this.messageheadererror = "Error: Call hase not been hangup";
          setTimeout(() => {
            this.messageheadererror = "";
          }, 5000);

        }

        this.loading = false;

      })

  }else{
     this.messageheadererror = "Error to Call Channel not found ";
        setTimeout(() => {
          this.messageheadererror = "";
        }, 5000);
  }

  }


  async ngOnInit() {
   
    
    this.alluser = JSON.parse(localStorage.getItem('username'));
    if(!this.alluser){
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      this.route.navigate(['login']);
    }

    

    await this.buyerservice.getBuyerDetails().subscribe((buyer:any)=>{
       this.buyerNumbers = buyer['buyer'].map(function(obj) {
        return { buyer_number:obj['number'], name: obj['name'] }
      });
    });

    /*this.buyerservice.getAllBuyers().subscribe((buyer:any)=>{  
      this.buyers = buyer['buyers'].map(function(obj) {
            return { buyer_id:obj['buyer_id'], name: obj['name'] }
          });
    });*/


    this.showmethod="loading"
    this.allRealtime()
    this.setIntervalId = setInterval(() => {
        this.allRealtime()
      }, 10000);
      
  }

  ngOnDestroy() {
    if(this.setIntervalId){
      clearInterval(this.setIntervalId);
    }
  }
  status: boolean = false;
  clickFilter() {
    // alert();
    this.status = !this.status;
  }
  token:any

  allRealtime() {
    
    if(this.alluser.role!='admin'){
      this.token={'token':'r3ByrH3W1U01dKvL','pub_id':this.alluser.uid}
    }else{
      this.token={'token':'r3ByrH3W1U01dKvL'}
    }
  
    this.service.getAllRealTime(this.token).subscribe((res: any) => {

      this.loading = false;

        if(res){

            this.data=res.map(({from_did,camp_name,pub_name,talking_to,buyer_number,queue,duration,channel,buyer_id})=>{
              var buyerName ='Unknown';
              /*if(buyer_id!=''){
                if(buyer_id!='0'){
                 buyerName = this.buyers.find(item=>item.buyer_id==buyer_id).name;
                }
              }*/

              if(buyer_number!=''){
                 let buyerNameObject = this.buyerNumbers.find(item=>item.buyer_number==buyer_number);

                 if(typeof buyerNameObject !='undefined'){
                   buyerName  = typeof buyerNameObject.name!='undefined'?buyerNameObject.name:buyerName
                 }
              }

              let data={
                from_did:from_did,
                camp_name:camp_name,
                pub_name:pub_name,
                talking_to:talking_to,
                buyer_number:buyer_number,
                queue:queue,
                duration:duration,
                channel:channel,
                buyer_name:buyerName
              }
              return data;
          });
        }else{
          this.data=[];
        }
        if(this.data==''){
          this.showmethod="no data";
        }else{
          this.showmethod="";
        }
        //console.log(this.showmethod)
      /*this.buyerservice.getAllBuyers().subscribe((buyer:any)=>{
        this.data=res.map(({from_did,camp_name,pub_name,talking_to,buyer_number,queue,duration,channel,buyer_id})=>{
          let data={
            from_did:from_did,
            camp_name:camp_name,
            pub_name:pub_name,
            talking_to:talking_to,
            buyer_number:buyer_number,
            queue:queue,
            duration:duration,
            channel:channel,
            buyer_name:buyer['buyers'].find(data=>data.buyer_id==buyer_id).name
          }
          return data 
        });
        console.log(this.data);
      })*/
      
    
    })

      // this.service.getAllRealTime(id).subscribe((res: Response) => {
      //   if(this.alluser.role=='buyer'){
      //   this.data = res;
       
      //     this.buyerservice.getNumberByid(this.alluser.uid).subscribe((buyerapi: Response) => {
      //       this.buyer = buyerapi['buyerNumber'];
      //       this.buyernum=this.buyer.map(({ number }) => number);
      //       for(var i of this.buyernum){
             
      //         if(this.buyerpush.index<0){
      //           var buyerdata=this.data.find(data=>data.buyer_number==i);
      //           var index=this.data.findIndex(data=>data.buyer_number==i);
      //           if(buyerdata !='' ){
      //             let array={
      //               'from_did':buyerdata.from_did,
      //               'talking_to':buyerdata.talking_to,
      //               'queue':buyerdata.queue,
      //               'buyer_number':buyerdata.buyer_number,
      //               'duration':buyerdata.duration,
  
      //             }
      //             this.buyerpush.splice(index, 1, array);
      //           }else{
      //             let array={
      //               'from_did':buyerdata.from_did,
      //               'talking_to':buyerdata.talking_to,
      //               'queue':buyerdata.queue,
      //               'buyer_number':buyerdata.buyer_number,
      //               'duration':buyerdata.duration,
  
      //             }
      //             this.buyerpush.push(array)
      //           }
      //         }else{
      //          var buyerpushdata= this.buyerpush.find(data=>data.buyer_number==i);
      //          var index= this.buyerpush.findIndex(data=>data.buyer_number==i);
      //          if(buyerpushdata !=''){
      //          var actualdata= this.data.findIndex(data=>data.buyer_number==i)
      //           if(actualdata==-1){
      //             this.buyerpush.splice(index, 1);
      //           }else{
      //             let array={
      //               'from_did':actualdata.from_did,
      //               'talking_to':actualdata.talking_to,
      //               'queue':actualdata.queue,
      //               'buyer_number':actualdata.buyer_number,
      //               'duration':actualdata.duration,
  
      //             }
      //             this.buyerpush.splice(index, 1, array);
      //           }

      //          }else{
      //           var actualdata= this.data.findIndex(data=>data.buyer_number==i)
      //           if(actualdata==-1){
      //             this.buyerpush.splice(index, 1);
      //           }else{
      //             let array={
      //               'from_did':actualdata.from_did,
      //               'talking_to':actualdata.talking_to,
      //               'queue':actualdata.queue,
      //               'buyer_number':actualdata.buyer_number,
      //               'duration':actualdata.duration,
  
      //             }
      //             this.buyerpush.push(array);
      //           }
      //          }


      //         }
              
              
      //       }
            
      //     });
      //   }else{
      //     this.buyerpush=res;
      //     this.data=this.buyerpush;
      //   }
        
      //   var chkDID=[];
      
      // })

  }
}
