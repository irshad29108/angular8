import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';    
@Pipe({
  name: 'publisherFilter'
})
export class PublisherFilterPipe implements PipeTransform {

  transform(items: any[], name: string, contact: string, email: string, role: string,currentDate:any): any {
    if (items && items.length) {
      let log= items.filter(item => {
        if (name && item.fullname.toLowerCase().indexOf(name.toLowerCase()) === -1) {
          return false;
        }
        if (contact && item.contact.toLowerCase().indexOf(contact.toLowerCase()) === -1) {
          return false;
        }
        if (email && item.email.toLowerCase().indexOf(email.toLowerCase()) === -1) {
          return false;
        }
        if (role && item.role.toLowerCase().indexOf(role.toLowerCase()) === -1) {
          return false;
        }
        if(currentDate.startDate ){
          const curr= new Date(item.created_at);
          return curr >= new Date(currentDate.startDate._d) && curr <= new Date(currentDate.endDate._d);
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
