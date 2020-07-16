import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'campaignFilter'
})
export class CampaignFilterPipe implements PipeTransform {

  transform(items: any[], name: string, buffer_time: string, Timezone: string, queue_name: string,queue_number:any,select:any,publisherdropdown:any): any {
    if (items && items.length) {
      let pub=+publisherdropdown;
      
      let log= items.filter(item => {
        if (name && item.camp_name.toLowerCase().indexOf(name.toLowerCase()) === -1) {
          return false;
        }
        if (buffer_time && item.buffer_time.toString().indexOf(buffer_time.toString()) === -1) {
          return false;
        }
        if (Timezone && item.time_zone.toLowerCase().indexOf(Timezone.toLowerCase()) === -1) {
          return false;
        }
        if (queue_name && item.queue_name.toLowerCase().indexOf(queue_name.toLowerCase()) === -1) {
          return false;
        }
        if (queue_number && item.queue_no.toString().indexOf(queue_number.toString()) === -1) {
          return false;
        }
        if(select.startDate ){
          const curr= new Date(item.created_at);
          return curr >= new Date(select.startDate._d) && curr <= new Date(select.endDate._d);
        }
        if (publisherdropdown && item.pub_id.toString().indexOf(pub.toString()) === -1 && publisherdropdown != "Select Publisher") {
          
          return false;
        }

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
