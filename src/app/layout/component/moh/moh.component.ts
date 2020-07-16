import { Component, OnInit } from '@angular/core';
import { TfnService } from 'src/app/servies/user/tfn.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-moh',
  templateUrl: './moh.component.html',
  styleUrls: ['./moh.component.css']
})
export class MohComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,public service: TfnService) { }
  showmethod=""
  data: any=[];
  alluser:any=[];
  tfn:any;
  tfn1:any=[]
  TFN:FormGroup;
  status:any;
  submitted=false;
  submitbutton=true;
  loading=false;
  edittfn=false;
  notedittfn=true;
  messageheader:any;
  messageheadererror: any;
  ngOnInit() {

    this.AddEditTfn();
    this.AllTfnnumber();
    this.service.getAllTFN().subscribe((res: Response) => {
      
      //this.data = res['data'];
       for(var i of res['tfn']){
        if(i.pub_id==this.alluser.uid || this.alluser.role=='admin'){
          let publisher
          if(i.publisherName=='' || i.publisherName==undefined){
            publisher='---'; 
          }else{
            publisher=i.publisherName;
          }
        let data1={
            'tfn':i.tfn,
            'publisherName':publisher,
            'purchase_date':i.purchase_date,
            'price_per_tfn':i.price_per_tfn,
            'status':i.status,
            '_id':i._id
       }
         this.tfn1.push(data1);
         
         }
       }
     
     
   });
  }
  AllTfnnumber() {
    this.alluser = JSON.parse(localStorage.getItem('username'));
    this.data=[];
    this.showmethod="loading"
    this.service.allMoh().subscribe((res: Response) => {
      
       this.data = res['data'];
      //  for(var i of res['tfn']){
      //   if(i.pub_id==this.alluser.uid || this.alluser.role=='admin'){
      //     let publisher
      //     if(i.publisherName=='' || i.publisherName==undefined){
      //       publisher='---'; 
      //     }else{
      //       publisher=i.publisherName;
      //     }
      //   let data1={
      //       'tfn':i.tfn,
      //       'publisherName':publisher,
      //       'purchase_date':i.purchase_date,
      //       'price_per_tfn':i.price_per_tfn,
      //       'status':i.status,
      //       '_id':i._id
      //  }
      //    this.data.push(data1);
      //    //this.data.sort((a,b) => b - a);
      //    }
      //  }
       this.data.reverse();
       if(this.data==''){
        this.showmethod="no data";
      }else{
        this.showmethod="";
      }

    });
  }
  button:any;
  add=false;
  clickadd() {
    // alert();
    this.TFN.reset();
    this.button="Update";
    this.edittfn=false;
    this.notedittfn=true
      this.add = !this.add;
       
  }
  edit(tfn,status){
   this.tfn=tfn;
   this.status=status
   this.TFN.reset();
   this.edittfn=true;
   this.notedittfn=false
   this.add = !this.add;
   
   
  }
  AddEditTfn() {
    //console.log(this.edittfn);
    this.TFN = this.formBuilder.group({
      tfn: ["", Validators.required],
      status: ["", Validators.required],
    });
  }
  get f(){
    return this.TFN.controls;
  } 
  onSubmit(){
    this.loading=true;
    this.submitbutton=false;
    this.submitted = true;
     if (this.TFN.invalid) {
      this.loading=false;
      this.submitbutton=true;
       return;
     }
    this.service.updateMoh(this.TFN.controls.tfn.value,this.TFN.controls.status.value).subscribe((res:Response)=>{
      //console.log(res);
      this.add = !this.add
      this.messageheader=res['success'];
      setTimeout(()=>{    //<<<---    using ()=> syntax
       this.messageheader = "";
      }, 5000);
      this.loading=false;
      this.submitbutton=true;
    })
    
  }
}
