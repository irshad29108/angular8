import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cdrQueueFilter'
})
export class CdrQueueFilterPipe implements PipeTransform {
  alluser:any;
  transform(items: any[], did: string, destination: string, cid: string, hangby: string, status: any,selected:any,publisherdropdown:any,QueueNumber:any,dispsition:any,extension:any): any {
    if (items && items.length) {
      let pub=+publisherdropdown;
      
      let log= items.filter(item => {
        if (did && item.did.toString().indexOf(did.toString()) === -1) {
          return false;
        }
        if (extension && item.extension.toString().indexOf(extension.toString()) === -1) {
          return false;
        }
        if (destination && item.destination.toLowerCase().indexOf(destination.toLowerCase()) === -1) {
          return false;
        }
        if (dispsition && item.disposition.toLowerCase().indexOf(dispsition.toLowerCase()) === -1) {
          return false;
        }
        if (cid && item.cid.toLowerCase().indexOf(cid.toLowerCase()) === -1) {
          return false;
        }
        if (hangby && item.hangby.toLowerCase().indexOf(hangby.toLowerCase()) === -1) {
          return false;
        }
       
        if (status !=false && status !=true && status !='' && status !=undefined  && item.status.toString().indexOf(status.toString()) === -1) {
          return false;
         }
         this.alluser = JSON.parse(localStorage.getItem('username'));
        // if(this.alluser.role!='publisher'){
         
          if (publisherdropdown && item.pub_id.toString().indexOf(pub.toString()) === -1 && publisherdropdown != "Select Publisher" ) {
            
            return false;
          }
//}
         if (QueueNumber && item.destination.toString().indexOf(QueueNumber.toString()) === -1 && QueueNumber != "Select Queue Number" ) {
          
          return false;
        }
        
        // if(selected.startDate ){
        //   const curr= new Date(item.created_at);
        //   return curr >= new Date(selected.startDate._d) && curr <= new Date(selected.endDate._d);
        // }
        

        //if(currentDate.endDate){
          //console.log(new Date(item.created_at) >= new Date(currentDate.endDate._d))
         // return new Date(item.created_at) >= new Date(currentDate.startDate._d)
        //}
        // if(currentDate.endDate && (new Date(item.created_at) <= new Date(currentDate.endDate._d))==true){
        //   console.log(new Date(item.created_at) <= new Date(currentDate.endDate._d))
        //   return false
        // }
        return true;
      })
    
      return log;
    }else {
      return items;
    }
  }

}
