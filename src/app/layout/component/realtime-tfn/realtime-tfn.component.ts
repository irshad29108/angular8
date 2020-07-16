import { Component, OnInit } from '@angular/core';
import { RealtimeService } from 'src/app/servies/realtime.service';
import { ManageBuyersService } from 'src/app/servies/user/manage-buyers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-realtime-tfn',
  templateUrl: './realtime-tfn.component.html',
  styleUrls: ['./realtime-tfn.component.css']
})
export class RealtimeTfnComponent implements OnInit {

  data: any = [];
  token:any;
  alluser: any;
  statuscode:any;
  messageheader: any;
  messageheadererror: any;
  loading:boolean = true;
  setIntervalId:any;
  buyers:any;
  buyerNumbers:any=[];
  UnknownTemplate:string ='<span class="label label-warning">Unknown</span>';
  constructor(public service:RealtimeService,public buyerservice:ManageBuyersService,public route:Router) { }

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

   this.allRealtime();
   this.setIntervalId = setInterval(() => {
      this.allRealtime()
    }, 10000);
    
  }


  ngOnDestroy() {
    if(this.setIntervalId){
      clearInterval(this.setIntervalId);
    }
  }

  allRealtime() {
   
    if(this.alluser.role!='admin'){
      this.token={'token':'r3ByrH3W1U01dKvL','pub_id':this.alluser.uid}
    }else{
      this.token={'token':'r3ByrH3W1U01dKvL'}
    }
    
    this.service.getAllRealTimeTFN(this.token).subscribe((res: any) => {
      var buyerName ='Unknown';
      this.loading = false;
      if(this.alluser.role=='admin'){
        this.data=res.map(({did,count,calls})=>{
          
          let data={
            did:did,
            count:count,
            calls:calls
            .map(({from_did,channel,talking_to,queue,buyer_number,duration,pub_id,pub_name,camp_name,buyer_id,status})=>{
              //console.log(buyer_id);
              //console.log(this.buyers);
              
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
              
              let calldata={
             
                from_did:from_did,
                channel:channel,
                talking_to:talking_to,
                queue:queue,
                buyer_number:buyer_number,
                duration:duration,
                pub_id:pub_id,
                pub_name:pub_name,
                camp_name:camp_name,
                status:status,
                buyer_name:buyerName
              }
              return calldata
            })
          }
          return data;
        })

        //console.log(this.data);
      }else{
        this.data=res.map(({did,count,calls})=>{
          
          let data={
            did:did,
            count:count,
            calls:calls
            .filter(data=>data.pub_id==this.alluser.uid)
            .map(({from_did,channel,talking_to,queue,buyer_number,duration,pub_id,pub_name,camp_name,buyer_id,status})=>{
              if(buyer_id!=''){
                if(buyer_id!='0'){
                 buyerName = this.buyers.find(item=>item.buyer_id==buyer_id).name;
                }
              }

              let calldata={
             
                from_did:from_did,
                channel:channel,
                talking_to:talking_to,
                queue:queue,
                buyer_number:buyer_number,
                duration:duration,
                pub_id:pub_id,
                pub_name:pub_name,
                camp_name:camp_name,
                status:status,
                buyer_name:buyerName
              }
              return calldata
            })
          }
          return data;
        })
      }
    })

  }
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


}
