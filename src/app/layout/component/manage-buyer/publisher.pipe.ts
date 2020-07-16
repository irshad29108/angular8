import { Pipe, PipeTransform } from '@angular/core';
import { ManagePublisherService } from 'src/app/servies/user/manage-publisher.service';

@Pipe({
  name: 'publisher'
})
export class PublisherPipe implements PipeTransform {
  sa:any=[];
  constructor(public publiserserive:ManagePublisherService) {
    this.publiserserive.getManagePublisher().subscribe((res)=>{
      this.sa=res['user']
    });
  }
  
  transform(value: any): any {
    return  this.sa.find(x=>x.uid==value).fullname;
      
  }

}
