import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], name: string, contact: string, email: string, price: string, status: any,currentDate:any,publisherdropdown:any): any {
    if (items && items.length) {
      console.log(status);
      let pub=+publisherdropdown;
      return items.filter(item => {
        if (name && item.name.toLowerCase().indexOf(name.toLowerCase()) === -1) {
          return false;
        }
        if (contact && item.contact.toLowerCase().indexOf(contact.toLowerCase()) === -1) {
          return false;
        }
        if (email && item.email.toLowerCase().indexOf(email.toLowerCase()) === -1) {
          return false;
        }
        if (price && item.price_per_call.toLowerCase().indexOf(price.toLowerCase()) === -1) {
          return false;
        }
        if (publisherdropdown && item.pub_id.toString().indexOf(pub.toString()) === -1 && publisherdropdown != "Select Publisher") {
          
          return false;
        }

          if (status !=false && status !=true  && item.status.toString().indexOf(status.toString()) === -1) {
           return false;
          }
          if(currentDate.startDate ){
            const curr= new Date(item.created_at);
            return curr >= new Date(currentDate.startDate._d) && curr <= new Date(currentDate.endDate._d);
          }
        return true; 
      });

    } else {
      return items;
    }
  }

}
