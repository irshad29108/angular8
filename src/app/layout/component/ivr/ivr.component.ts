import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,FormArray,FormControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IvrService } from 'src/app/servies/ivr/ivr-service';
import { Item } from 'angular2-multiselect-dropdown';
import { Select2OptionData } from 'ng-select2';
import {Router,ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/toPromise'
import { ThemeService } from 'ng2-charts';
import { ManageQueueService } from 'src/app/servies/user/manage-queue.service';

@Component({
  selector: 'app-ivr',
  templateUrl: './ivr.component.html',
  styleUrls: ['./ivr.component.css']
})
export class IvrComponent implements OnInit {
  public popoverTitle: string = 'Title';
  public popoverMessage: string = 'Are you really sure you want to do this?';
  public popoverClass: string = 'custompop';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
  public filetePanel:boolean=false;
  
  addIVR:boolean=false;
  FormgroupClass:FormGroup;
  FormgroupClassIvrEntry:FormGroup;
  button:any="Add"
  submitted=false;
  loading=false;
  editData:any
  data:any=[]
  public MusicData: Array<Select2OptionData>;
  public QueData: Array<Select2OptionData>;
  public selectionData: Array<Select2OptionData>;
  name: string;
  description: string;
  announcement: string;
  tab: any = 'tab1';
  ivr_id=0;
  ivr_entryid=0;
  ivrDetailData= [];
  ivrEntryData=[];
  edit_parameters:any;
  alluser:any;
  pubQueue:any

  constructor(public fb:FormBuilder,public ivrService:IvrService,public toaster:ToastrService,public routepart:Router,private ActivatedRoute: ActivatedRoute,public queue: ManageQueueService,) { 
  }

   ngOnInit() {
    this.alluser = JSON.parse(localStorage.getItem('username'));
    this.form();
    this.allIVRData();
    //this.allIVREntry()
    this.getAllIVRMusic()
    this.edit_parameters = this.ActivatedRoute.snapshot.queryParams.ivr_id;
    this.getQueData()

    this.selectionData = Array.from(Array(10).keys()).map(res=>{
        let data={
           'id':res.toString(),
           'text':res.toString()
         }
      return data;
   })
   
  }  

  getQueData(){

    if(this.alluser.role=='publisher' || this.alluser.role=="monitor"){
        
       /*this.queue.getQueueNumberByPubId(this.alluser.uid).subscribe((res: Response) => {
        var queuelist=[];
        res['queues'].map((newrole)=>{

          this.queue.getQueueNumberByQueueId(newrole.queue_id).subscribe((response: Response) => {
      
            this.pubQueue = response['queueNumber'];
            this.exampleData = this.pubQueue.map((src)=>{
              queuelist.push(src.number)
              let data = {
                'id': src.number,
                'text': src.number
              }
              return data;
            })
          })
         })

      })*/

      /*this.queue.getQueueNumberByPubId(this.alluser.uid).subscribe((res:Response)=>{
        this.queuelist=[];
        this.newrole=res['queues']
        for(var i of this.newrole){
          this.queue.getQueueNumberByQueueId(i.queue_id).subscribe((response:Response)=>{

              this.pubQueue=response['queueNumber'];
              for (var j of this.pubQueue){
                let data={
                  'id':j.number,
                  'text':j.number,
                 
                }
                this.queuelist.push(data);
              }
              this.exampleData=this.queuelist;
              
          })
        }
      })*/
     
    }else{

      this.queue.postQueueNumberFreepbx().subscribe((res: Response) => {
        this.pubQueue = res;
        var queuelist =[]
        for (var j of this.pubQueue){
          let data={
            'id':j.extension,
            'text':j.extension,
           
          }
          queuelist.push(data);
        }
        this.QueData=queuelist;
      });
      
      /*this.queue.postQueueNumberFreepbx().subscribe((res: Response) => {
        var pubQueue = res;
        this.QueData = pubQueue.map(res=>{
           let data={
                'id':res.extension,
                'text':res.extension
              }
              return data;
        })
      });*/
    }
  }
  
  get f(){
    return this.FormgroupClass.controls;
  }
  
  /*get fEntry(){
    return this.FormgroupClassIvrEntry.controls;
  }*/

  form(){
    this.FormgroupClass=this.fb.group({
      name:['',Validators.required],
      description:['',Validators.required],
      announcement:['',Validators.required],
      
      directdial:'Disabled',
      invalid_loops:3,
      invalid_retry_recording:'default',
      invalid_destination:'app-blackhole,hangup,1',
      timeout_enabled:'NULL',
      invalid_recording:'default',
      retvm:'',
      timeout_time:10,
      timeout_recording:'default',
      timeout_retry_recording:'default',
      timeout_destination:'',
      timeout_loops:3,
      timeout_append_announce:0,
      invalid_append_announce:0,
      timeout_ivr_ret:0,
      invalid_ivr_ret:0,
      alertinfo:'',
      rvolume:0,
      id:0
    });

    this.FormgroupClassIvrEntry=this.fb.group({
      // dest:['',Validators.required],
      // selection:['',Validators.required],
      // ivr_id:this.ivr_id,
      // ivr_ret:0,

      quantities:this.fb.array([
        this.fb.group({
          dest:['',Validators.required],
          selection:['',Validators.required],
          ivr_id:this.ivr_id,
          ivr_ret:0,
        })
      ])

    
    })
  }

  quantities() : FormArray {
    return this.FormgroupClassIvrEntry.get("quantities") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
    dest:['',Validators.required],
    selection:['',Validators.required],
    ivr_id:this.ivr_id,
    ivr_ret:0,
    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity(i:number) {
    this.quantities().removeAt(i);
  }

  clicktoAddIVR(){
    this.addIVR = !this.addIVR
  }

  onSubmit(){
    this.submitted=true;
    
    if(this.FormgroupClass.invalid){
      return;
    }else{
      this.loading=true;
      //this.ivr_id = 0;

      /*if(this.FormgroupClass.value.id){
        
        this.ivrService.editIvr(this.FormgroupClass.value).subscribe((ivr:any)=>{
          this.loading=false;
          this.toaster.success('Ivr', 'Ivr Update successfully')
          this.addIVR = !this.addIVR
        })
      }*/

     if(this.ivr_id){

        this.FormgroupClass.controls.id.setValue(this.ivr_id)

        this.ivrService.editIvr(this.FormgroupClass.value).subscribe((res:any)=>{

          if (res['statusCode'] == '200') {
            this.loading=false;
            this.nextStep(2);
            
          }else{
            this.toaster.error('Error', 'Something went wrong')
            this.routepart.navigate(['/dashboard/ivr-entry'])
          }

        })
      }else{

          this.ivrService.addIvr(this.FormgroupClass.value).subscribe((ivr:any)=>{

            if (ivr['statusCode'] == "200") {
              this.loading=false;
              this.ivr_id = ivr.id;
              this.nextStep(2);
            }else{
              this.toaster.success('Error', 'Something went wrong')
              this.routepart.navigate(['/dashboard/ivr-entry'])
            }
        })
      }
     

    }
  }

  onSubmitEntry(){

    if(this.FormgroupClassIvrEntry.invalid){
      return;
    }


    /*var ivr_data = {
      dest:this.FormgroupClassIvrEntry.value.dest,
      selection:this.FormgroupClassIvrEntry.value.selection,
      ivr_id:this.ivr_id,
      ivr_ret:0,
    }*/

    this.ivrEntryData =this.FormgroupClassIvrEntry.value.quantities.map(res=>{

       let ivr_data = {
          dest:res.dest,
          selection:res.selection,
          ivr_id:this.ivr_id,
          ivr_ret:0,
        }
        return ivr_data
    })


   // this.FormgroupClassIvrEntry.patchValue({ivr_id:this.ivr_id})
    //this.FormgroupClassIvrEntry.controls.ivr_id.setValue(this.ivr_id)
    this.loading=true;


    if(this.ivr_entryid){

      this.ivrService.deleteIvrEntries(this.ivr_entryid).subscribe((res:any)=>{

        if (res['statusCode'] == '200') {
        
          this.ivrService.addIvrEntries(this.ivrEntryData).subscribe((ivr:any)=>{

            if (ivr['statusCode'] == "200") {
              this.toaster.success('Ivr', 'Ivr Updated successfully');
              this.loading=false;

              this.ivrService.getQueueRelod().subscribe((resdat: Response) => {

              })

              this.routepart.navigate(['/dashboard/ivr-entry']);

            }else{
              this.toaster.error('Error', 'Something went wrong')
            }
        
          })
        }else{
          this.toaster.error('Error', 'Something went wrong')
          this.routepart.navigate(['/dashboard/ivr-entry'])
        }

      })

    }else{

      this.ivrService.addIvrEntries(this.ivrEntryData).subscribe((ivr:any)=>{
        this.loading=false;
        if (ivr['statusCode'] == "200") {
          this.toaster.success('Ivr', 'Ivr added successfully')
          this.ivrService.getQueueRelod().subscribe((resdat: Response) => {

          })
          this.routepart.navigate(['/dashboard/ivr-entry'])
        }
      })

    }

  
  }

  async allIVRData(){
    await this.ivrService.getAllIvr().subscribe((ivr:any)=>{
      if(ivr['statusCode']==200){
        this.data = ivr['data'];
        if(this.edit_parameters){
          this.editIvr(this.edit_parameters);
        }
      }
    })
  }

  /*async allIVREntry(){

    await this.ivrService.getIvrEntries().subscribe((ivr:any)=>{
      if(ivr['statusCode']==200){
        this.ivrDetailData= ivr['data'];
        if(this.edit_parameters){
          this.editIvrEntry(this.edit_parameters);
        }
      }
    })

  }*/



  getAllIVRMusic() {
    this.ivrService.getAllmusics().subscribe((res: Response) => {
      let response = res;
      if (response['statusCode'] == '200') {
        let responseData = response['data'];
        this.MusicData =responseData.map(res=>{
          let Array = {
            'id': res.id,
            'text': res.displayname
          }
          return Array;
        })
      }

    })
  }

  editIvr(id){

    this.editData=this.data.find(Item=>Item.id==id)

    if(this.editData!='undefined'){
      this.ivr_id = typeof this.editData.id?this.editData.id:0;

      let show={

        name:this.editData.name,
        description:this.editData.description,
        announcement:this.editData.announcement,

        directdial:this.editData.directdial,
        invalid_loops:this.editData.invalid_loops,
        invalid_retry_recording:this.editData.invalid_retry_recording,
        invalid_destination:this.editData.invalid_destination,
        timeout_enabled:this.editData.timeout_enabled,
        invalid_recording:this.editData.invalid_recording,
        timeout_time:this.editData.timeout_time,
        timeout_recording:this.editData.timeout_recording,
        timeout_retry_recording:this.editData.timeout_retry_recording,
        timeout_destination:this.editData.timeout_destination,
        timeout_loops:this.editData.timeout_loops,
        timeout_append_announce:this.editData.timeout_append_announce,
        invalid_append_announce:this.editData.invalid_append_announce,
        id:[this.editData.id]
      }
      this.FormgroupClass.patchValue(show)
      this.button = 'Edit'
    }

  }



 /* editIvrEntry(id){

    this.editData=this.ivrDetailData.find(Item=>Item.ivr_id==id)
     if(this.editData!='undefined'){
      this.ivr_entryid = typeof this.editData.ivr_id?this.editData.ivr_id:0;

      let show={
        dest:this.editData.dest,
        selection:this.editData.selection,
        ivr_id:this.editData.ivr_id,
        ivr_ret:0
      }

      this.FormgroupClassIvrEntry.patchValue(show)
    }
  }*/


  delete(id){
    this.ivrService.deleteIvr(id).subscribe((res:any)=>{
      if (res['statusCode'] == '200') {
        this.allIVRData();
        this.toaster.success('Succes', 'IVR-Data  deleted succesfully')
      } else {
        this.toaster.error('Error', 'Something went wrog')
      }
    })
  }

clickFilter(){
    this.filetePanel =!this.filetePanel;
}
resetfilter(){
  this.name = '';
}

closefiltr(num) {
  if (num == 'filtr1') {
    this.name = '';
  }
  this.allIVRData();
}


nextStep(check) {
  this.tab = 'tab' + check;
  this.name = this.FormgroupClass.controls.name.value;
  this.description = this.FormgroupClass.controls.description.value;
  this.announcement = this.FormgroupClass.controls.announcement.value;

}

}
