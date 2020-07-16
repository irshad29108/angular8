import {Pipe,PipeTransform} from '@angular/core';
@Pipe({
    name:'IvrMusicPipe'
})
export class IvrMusicPipe implements PipeTransform{

    transform(items:any[],displayname:string,filename:string):any{
        if(items && items.length){
            return items.filter(item=>{
                if(displayname !=undefined && item.displayname.toLowerCase().indexOf(displayname.toLowerCase())===-1){
                    return false;
                }
                
                if(filename !=undefined && item.filename.toLowerCase().indexOf(filename.toLowerCase())===-1){
                    return false;
                }
                return true; 
            })
        }else {
        return items;
      }
    }

}
