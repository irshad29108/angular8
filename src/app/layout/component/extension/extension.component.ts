import { Component, OnInit } from '@angular/core';
import { ExtensionService } from 'src/app/servies/extension.service';
import { CampaignService } from 'src/app/servies/campaign/campaign.service';
import { Select2OptionData } from 'ng-select2';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PublisherModalService } from 'src/app/servies/modal/publisher-modal.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.css']
})
export class ExtensionComponent implements OnInit {
  allQueueNumber:any=[];
  queuenumber;
  public popoverTitle: string = 'Title';
  public popoverMessage: string = 'Are you really sure you want to do this?';
  public popoverClass: string = 'custompop';
  submitted=false;
  queueNumber:FormGroup
  data:any=[]
  showmethod="";
  public QueueNumber: Array<Select2OptionData>;
  constructor(public service:ExtensionService,public campService:CampaignService,public formBuilder: FormBuilder,public publisherModel: PublisherModalService,public tost:ToastrService) { }
  alluser = JSON.parse(localStorage.getItem('username'));
  ngOnInit() {
    this.addQueueNumber();
    console.log(this.showmethod);
    this.campService.getallcampaign().subscribe((camp:Response)=>{
      let publisher_id=''
      if(this.alluser.role=='publisher'){
        publisher_id=this.alluser.uid
      }
     this.QueueNumber= camp['campaigns'].filter(data=>data.inside_route !='')
     
     .map(({inside_route,queue_no,queue_name,pub_id})=>{
          if(publisher_id!=''){
            if(publisher_id==pub_id){
           let data= {
              id: queue_no,
              text: queue_no
            }
            return data;
          }
         }else{
          let data= {
            id: queue_no,
            text: queue_no
          }
          return data;
         }
      })
      // this.QueueNumber.reverse();
      
      console.log( this.QueueNumber);
    })
  }
  addExt(queue){
    this.service.postAddExt(queue).subscribe((res:Response)=>{
      console.log(res);
      if(res['statusCode']=="200"){
        this.tost.success('Extensions','Extension Successfully Added')
        this.closeModal('QueueNumber');
      }else{
        this.tost.error('Extensions','Extension Adding Facing some issue')
      }
    })
  }
  changeQueueNumber(){
    if(this.queuenumber!=''&& this.queuenumber!=null){
      this.getExtByQueue();
  }
    }
    
  getExtByQueue(){
    this.showmethod="loading"
    //console.log(this.queuenumber);
    if(this.queuenumber!=''&& this.queuenumber!=null){
      this.service.postAllExtByQueue(this.queuenumber).subscribe((ext:Response)=>{
       // console.log(ext);
        this.data=ext['data']
        this.data.reverse();
        if(this.data==''){
          this.showmethod="no data";
        }else{
          this.showmethod="";
        }
      })
    }
    
  }
  addQueueNumber() {
    this.queueNumber = this.formBuilder.group({
      queue: ['', Validators.required],
      extensions: ['', Validators.required],
     
    })
  }
  onSubmitExt(){
    console.log(this.queueNumber);
    this.submitted=true
    if(this.queueNumber.invalid){
      return;
    }
    let data={
      'queue':this.queueNumber.controls.queue.value,
      'extensions':this.queueNumber.controls.extensions.value.map(({ value }) => value)
    }
    this.addExt(data);
   
   // console.log(this.queueNumber);
  }
  openModal(id: string) {
    this.publisherModel.open(id);
  }
  closeModal(id: string) {
    this.publisherModel.close(id);
  }
  get Queuenumbervalid(){
    return this.queueNumber.controls;
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  delete(ext){
    this.service.deleteExtByQueue(ext,this.queuenumber).subscribe((res:Response)=>{
      console.log(res);
      if(res['statusCode']=="200"){
        this.tost.success('Extensions','Extension Successfully Deleted')
      }else{
        this.tost.error('Extensions','Extension Adding Facing some issue')
      }
      this.getExtByQueue();
    })
  }

}
