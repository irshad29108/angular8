import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usage'
})
export class UsagePipe implements PipeTransform {

  transform(items: any[], did: string): any {
    if (items && items.length) {
      let log= items.filter(item => {
        console.log(typeof(did))
        if (did && item._id.indexOf(did) === -1) {
          return false;
        }
        
        return true;
      })
     
      return log;
    }else {
      return items;
    }
  }

}
