import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CampaignService } from 'src/app/servies/campaign/campaign.service';
import { ManageBuyersService } from 'src/app/servies/user/manage-buyers.service';
@Component({
  selector: 'app-addcampaign',
  templateUrl: './addcampaign.component.html',
  styleUrls: ['./addcampaign.component.css']
})
export class AddcampaignComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router,public service:CampaignService,public buyerservice:ManageBuyersService) { }
  Campaign:FormGroup;
  allBuyerDropdown:any=[];
  BuyerNumberDropdown:any=[];
  BuyerNumber:any=[]
  submitted=false;
  dropdownList = [];
  show=false;
  queue=true;
  buyerDropdownSettings={};
  buyerSettings={};
  selectedItems = [];
  dropdownSettings = {}
  ngOnInit() {
   let data= JSON.parse(localStorage.getItem('username'))
    //console.log(data.uid);
    this.service.getTfnByID(data.uid).subscribe((res:Response)=>{
     // console.log(res);
     
      for(var i of res['tfn']){
        let data={
          'id':i.tfn,
          'itemName':i.tfn
        }
        this.dropdownList.push(data);
      }
    })
    this.buyerservice.getAllBuyers().subscribe((res:Response)=>{
      
      this.allBuyerDropdown=res['buyer'].map(({buyer_id,name})=>{
        let buyer={
          id:buyer_id,
          name:name,
        }
        return buyer;
      })
      
    })

     this.dropdownSettings = { 
      singleSelection: false, 
      text:"Select Tfn",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes:"myclass custom-class"
    }; 
    this.buyerSettings ={
      singleSelection: false, 
      text:"Select Buyer",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes:"myclass custom-class"
    }
    this.buyerDropdownSettings = { 
      singleSelection: false, 
      text:"Select Buyer Number",
      // selectAllText:'Select All',
      // unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes:"myclass custom-class"
    };   
        this.Form();           
}
priority: any[] = [
  { id: 0, name: '0' },
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' },
  { id: 4, name: '4' },
  { id: 5, name: '5' }
];
selected: number = 0;
selectOption(id: number) {
  //getted from event
  console.log(id);
  //getted from binding
  
}

ChangeRoute(){
  
  if(this.Campaign.controls.route.value==1){
    this.show=true;
    this.queue=false
  }else{
    this.show=false;
    this.queue=true;
  }
}
somethingChanged(){
  this.BuyerNumberDropdown=[];
  this.buyerservice.getNumberByid(this.Campaign.controls.buyer.value).subscribe((res:Response)=>{
    console.log(res);
    //this.BuyerNumberDropdown=res['buyerNumber'];
    for(var i of res['buyerNumber']){
      let data={
        'id':i._id,
        'pause_status':i.status,
        'capping':i.capping,
        'queue':i.queue,
        'itemName':i.number,
        'global_cap':i.global_cap,
        'priority':i.priority,
        'buyer_number':i.number,
        'buyer_id':i.buyer_id,
      }
      this.BuyerNumberDropdown.push(data)
    }
  })
}
onItemSelect(item:any){
console.log(item);
console.log(this.selectedItems);
}
OnItemDeSelect(item:any){
console.log(item);
console.log(this.selectedItems);
}
onSelectAll(items: any){
console.log(items);
}
onDeSelectAll(items: any){
console.log(items);

    
  }


  onBuyerSelect(item:any){
    console.log(item);
    console.log(this.BuyerNumberDropdown);
    }
    OnBuyerDeSelect(item:any){
    console.log(item);
    console.log(this.BuyerNumberDropdown);
    }
    onBuyerSelectAll(items: any){
    console.log(items);
    }
    onBuyerDeSelectAll(items: any){
    console.log(items);
    
        
      }

  Form(){
    this.Campaign = this.formBuilder.group({
      title: ['', Validators.required],
      buffer_time: ['', Validators.required],
      price_per_call: ['', Validators.required],
      zone: ['', Validators.required],
      route: ['', Validators.required],
      buyerNumber:[''],
      buyer:['', Validators.required],
      Tfn:['',Validators.required],
      queue:['']
    
  });
}
onSubmit(){
  this.submitted = true;
    if (this.Campaign.invalid) {
      return;
    }
    let data= JSON.parse(localStorage.getItem('username'))
    console.log(data.uid);
    let submitCampign
    if(this.Campaign.controls.queue.value!=''){
      submitCampign={
        'pub_id':data.uid,
        'camp_name':this.Campaign.controls.title.value,
        'buffer_time':this.Campaign.controls.buffer_time.value,
        'buyer_id':this.Campaign.controls.buyer.value,
        'price_per_call':this.Campaign.controls.price_per_call.value,
        'time_zone':this.Campaign.controls.zone.value,
        'read_only':0,
        'inside_route':this.Campaign.controls.queue.value,
        'tfns':[this.Campaign.controls.Tfn.value.map(({ id }) => id).join(",")],
      }
    }else{
      console.log(this.Campaign.controls.buyer.value);
      submitCampign={
        'pub_id':data.uid,
        'camp_name':this.Campaign.controls.title.value,
        'buffer_time':this.Campaign.controls.buffer_time.value,
        'buyer_id':this.Campaign.controls.buyer.value,
        'price_per_call':this.Campaign.controls.price_per_call.value,
        'time_zone':this.Campaign.controls.zone.value,
        'read_only':0,
        'inside_route':'',
        'tfns':[this.Campaign.controls.Tfn.value.map(({ id }) => id).join(",")],
        'buyer_numbers':this.Campaign.controls.buyerNumber.value

      }
    }
   
    
  this.service.postaddcampaign(submitCampign).subscribe((res:Response)=>{
    console.log(res);
  })
  
}
get campaign(){
  return this.Campaign.controls;
}

}
