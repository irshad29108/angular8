import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tfnFilter'
})
export class TfnFilterPipe implements PipeTransform {

  transform(items: any[], number: string, publisherdropdown: string, price: string,  selected: any,status:any,pub_name_show:any): any {
    if (items && items.length) {
     
      
      return items.filter(item => {
        let pub=+publisherdropdown;
        //console.log(pub)
        if (pub && item.pub_id.toString().indexOf(pub.toString()) === -1 && publisherdropdown != "Select Publisher") {
         // console.log(pub)
          return false;
        }
    
        if (number && item.tfn.toLowerCase().indexOf(number.toLowerCase()) === -1) {
          
          return false;
        }
        if (pub_name_show && item.publisherName.toString().indexOf(pub_name_show.toString()) === -1) {
          return false;
        }
        if (price && item.price_per_tfn.toString().indexOf(price.toString()) === -1) {
          return false;
        }
        if (status && item.status.toString().indexOf(status.toString()) === -1) {
          return false;
        }
      
        // if (selected.startDate) {
   
        //   const curr = new Date(item.created_at);
        //   console.log(curr);
        //   return curr >= new Date(selected.startDate._d) && curr <= new Date(selected.endDate._d);
        // }
        
        return true;
      });

    } else {
      return items;
    }
  }

}
