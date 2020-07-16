import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ivr'
})
export class IvrPipe implements PipeTransform {

  transform(items:any[],name:string):any{
    if(items && items.length){
    return items.filter(item=>{
        if(name  && item.name.toLowerCase().indexOf(name.toLowerCase())===-1){
            return false;
        }
        
         return true; 
    })

    }
    else {
    return items;
  }
}

}
