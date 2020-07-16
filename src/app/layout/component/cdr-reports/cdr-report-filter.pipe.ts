import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cdrReportFilter'
})
export class CdrReportFilterPipe implements PipeTransform {

  transform(items: any[], did: string, destination: string, cid: string, hangby: string, status: any,selected:any,publisherdropdown:any,campaigndropdown:any,buyernumberFilter:any,disposition:any,buyer_name:any,buyerdropdown:any): any {
    if (items && items.length) {
     
      let pub=+publisherdropdown;
      let camp=+campaigndropdown;
      let buyer=+buyernumberFilter;
      let log= items.filter(item => {
        
        if (did && item.did.toString().indexOf(did.toString()) === -1) {
          return false;
        }

        /*if (did && item.did.toString().indexOf(did.toString()) === -1) {
          return false;
        }*/

      
        if (destination && item.destination.toLowerCase().indexOf(destination.toLowerCase()) === -1) {
          return false;
        }
        if (disposition && item.disposition.toLowerCase().indexOf(disposition.toLowerCase()) === -1) {
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

        if (buyer_name && item.buyer_name.toLowerCase().indexOf(buyer_name.toLowerCase()) === -1) {
          return false;
        }

        if (buyerdropdown && item.buyer_name.toLowerCase().indexOf(buyerdropdown.toLowerCase()) === -1) {
          return false;
        }

        
        // if(item.pub_id && item.pub_id!=0){

          if (publisherdropdown && item.pub_id.toString().indexOf(pub.toString()) === -1 && publisherdropdown != "Select Publisher") {
            //console.log(item.pub_id)
            return false;
          }
       // }
        
          //console.log(pub)
            if (campaigndropdown && item.camp_id.toString().indexOf(camp.toString()) === -1 && campaigndropdown !="Select Campaign") {
              return false;
            }
            //console.log(item.buyer_id);
            if( item.buyer_id!=undefined ){
              //console.log(item.buyer_id);
            // console.log(item.buyer_id)
            if (buyer  && item.buyer_id.toString().indexOf(buyer.toString()) === -1) {
             // console.log(item.buyer_id)
              return false;
            }
            }
    
        return true;
      })
     
      return log;
    }else {
      return items;
    }
  }
}
