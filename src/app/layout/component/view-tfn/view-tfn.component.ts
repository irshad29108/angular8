import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TfnService } from 'src/app/servies/user/tfn.service';
import { HttpClient } from 'selenium-webdriver/http';
import { ManagePublisherService } from 'src/app/servies/user/manage-publisher.service';
import { Select2OptionData } from 'ng-select2';
import { ToastrService } from 'ngx-toastr';
import { CampaignService } from 'src/app/servies/campaign/campaign.service';
//import {SelectionModel} from '@angular/cdk/collections';
@Component({
  selector: 'app-view-tfn',
  templateUrl: './view-tfn.component.html',
  styleUrls: ['./view-tfn.component.css']
})
export class ViewTfnComponent implements OnInit {
  publisherdropdown: any = 'Select Publisher';
  data: any = []
  iconClasses = {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning'
  };
  masterSelected:boolean;
  checklist:any;
  checkedList:any=[];
  countCheck:any=0;
  searchText;
  public popoverTitle: string = 'Popover title';
  public popoverMessage: string = 'Are you really wants to delete?';
  public popoverMessage_used: string = 'This TFN is being used in campaign, do you really want to continue?';
  public popoverMessage_aunsign: string = 'This TFN is being used in campaign, do you really want to free from compaign?';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
  public popoverClass: string = 'custompop';
  public publisherdrop: Array<Select2OptionData>;
  TFN: FormGroup;
  selected: any;
  showpub: any;
  alwaysShowCalendars: boolean;
  submitted = false;
  submitbutton = true;
  loading = false;
  shownum = true;
  shownumNot = false;
  page:any;
  ranges: any = {

    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    //  'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],

  }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  uid: any;
  number: string;
  name: string;
  price: string;
  statuscode: any;
  messageheader: any;
  messageheadererror: any;
  edittfn: any = [];
  pubdrop: any;
  showmethod = ""
  publisher: any;
  dropdownpublisher: any = [];
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, public service: TfnService, public publiserserive: ManagePublisherService, public campignservice: CampaignService) {
    this.alwaysShowCalendars = true;
  }


  ngOnInit() {
    //FormGroup Of Tfn
    this.AddEditTfn();
    // this.data.reverse();
    //     this.data.filterPredicate = function(data, filter: string): boolean {
    //   return data.publisherName.toLowerCase().includes(filter) || data.tfn.toLowerCase().includes(filter) || data.status.toString() === filter;
    // };
    //All Tfn show
    this.AllTfnnumber();
    this.alluser = JSON.parse(localStorage.getItem('username'));
    if (this.alluser.role == 'publisher') {
      this.showpub = false;
    } else {
      this.showpub = true;
    }

   // console.log(this.showpub);

    //get All Publisher
    this.publiserserive.getManagePublisher().subscribe((res: Response) => {
      // console.log(res);
      this.publisher = res['user'];
      for (var publisher of this.publisher) {
        if (publisher.role == 'publisher') {
          let data = {
            'text': publisher.fullname + '    -   (' + publisher.email + ')',
            'id': publisher.uid,

          }
          this.dropdownpublisher.push(data);

        }
        this.publisherdrop = this.dropdownpublisher
      }

    })

  }



  //========================================= TFN Details ===================================================

  //Hide and show Tfn 

  add: boolean = false;
  button: any
  clickadd(no) {
    // alert();
    this.button = "Add";
    if ('no' == no) {
      this.TFN.reset();
      this.add = !this.add;
      this.shownumNot = false;
      this.shownum = true;
    } else {
      this.add = !this.add;

    }

  }
  //Edit Tfn Number Status
  edit(id) {
    this.button = "Update";
    this.add = !this.add;
    if (id != null && id != '' && id != undefined) {
      this.shownumNot = true;
      this.shownum = false;
    } else {
      this.shownumNot = false;
      this.shownum = true;
    }
    this.service.getTFNbyObjectId(id).subscribe((res: Response) => {
      // console.log(res);
      this.statuscode = res['status'];
      this.loading = false;
      this.submitbutton = true;
      if (this.statuscode == 'success') {

        this.edittfn = res['tfn'];
        this.AddEditTfn();

      } else {
        this.messageheader = "";
        this.messageheadererror = res['message'];
        setTimeout(() => {    //<<<---    using ()=> syntax
          this.messageheadererror = "";
        }, 5000);
      }
    })


  }
  //Validation of Tfn number 
  get f() { return this.TFN.controls; }

  //FormGroup Of Tfn
  valid: any = '';
  AddEditTfn() {
    if (this.alluser.role == 'admin') {
      this.valid = Validators.required;
    }
    //console.log(this.edittfn);
    this.TFN = this.formBuilder.group({
      tfn_number: [this.edittfn.tfn, Validators.required],
      price_per_tfn: [this.edittfn.price_per_tfn, Validators.required],
      status: [this.edittfn.status],
      id: [this.edittfn._id],
      publisher: [this.edittfn.pub_id, this.valid],
      tfn_number_show: [this.edittfn.tfn],
      price_per_tfn_show: [this.edittfn.price_per_tfn],

    });
  }

  //Show all Tfn number
  AllTfnnumber() {
    this.data = [];
    this.showmethod = "loading"
    this.service.getAllTFN().subscribe((res: Response) => {

      //this.data = res['tfn'];
     //  console.log(res['tfn']);
      for (var i of res['tfn']) {
        if (i.pub_id == this.alluser.uid || this.alluser.role == 'admin') {
          let publisher
          if (i.publisherName == '' || i.publisherName == undefined) {
            publisher = '---';
          } else {
            publisher = i.publisherName;
          }
          let data1 = {
            'tfn': i.tfn,
            'publisherName': publisher,
            'purchase_date': i.purchase_date,
            'price_per_tfn': i.price_per_tfn,
            'status': i.status,
            'pub_id': i.pub_id,
            '_id': i._id,
            'created_at':i.created_at,
            'isSelected':false
          }
          this.data.push(data1);
          //this.data.sort((a,b) => b - a);
        }
      }
      this.data.reverse();
      //console.log(this.data);
      if (this.data == '') {
        this.showmethod = "no data";
      } else {
        this.showmethod = "";
      }

    });
  }
  alluser: any = [];

  //Tfn number Submit  data
  onSubmit() {

    this.submitted = true;
    if (this.TFN.invalid) {
      return;
    }
    if (this.alluser.role == 'publisher') {
      this.pubdrop = this.alluser.uid;
    } else {
      this.pubdrop = this.TFN.controls.publisher.value;
    }

    this.loading = true;
    this.submitbutton = false;
    let tfnsubmit = {
      'tfn': [this.TFN.controls.tfn_number.value],
      "price_per_tfn": this.TFN.controls.price_per_tfn.value,
      "status": "available",
      "pub_id": this.pubdrop,
      "purchase_date": new Date(),
    }


    if (this.TFN.controls.id.value == '' || this.TFN.controls.id.value == null) {
      
      this.service.getTFN(tfnsubmit).subscribe((res: Response) => {
        // console.log(res);
        this.loading = false;
        this.submitbutton = true;
        this.statuscode = res['status'];

        if (this.statuscode == 'success') {

          this.add = !this.add;
          this.service.getTfnFreepbxAdd(this.TFN.controls.tfn_number.value).subscribe((res: Response) => {
            this.campignservice.getQueueRelod().subscribe((resdat: Response) => {
              //console.log(resdat); 

            })
            //console.log(res);
          })
          this.AllTfnnumber();
          this.messageheader = res['message'];
          setTimeout(() => {    //<<<---    using ()=> syntax
            this.messageheader = "";
          }, 5000);
          this.resetpublisher();
          this.resetfilter();



        } else {
          this.messageheader = "";
          this.messageheadererror = res['message'];
          setTimeout(() => {    //<<<---    using ()=> syntax
            this.messageheadererror = "";
          }, 5000);
        }
      })
    } else {


      let tfnsubmit = {
        'tfn': [this.TFN.controls.tfn_number.value],
        "price_per_tfn": this.TFN.controls.price_per_tfn.value,
        "status": "available",
        "pub_id": this.pubdrop,
        "purchase_date": new Date(),
      }

      if(this.TFN.controls.status.value !='available'){

        this.service.getUnsignTfn(this.TFN.controls.tfn_number.value).subscribe((res: Response) => {
          if (res['statusCode'] == "200") {
            
            this.service.deleteTFN(this.TFN.controls.id.value).subscribe((res: Response) => {
                this.statuscode = res['status'];
        
              if (this.statuscode == 'success') {
                this.service.getTFN(tfnsubmit).subscribe((res: Response) => {
                  this.add = !this.add;
                  this.loading = false;
                  this.submitbutton = true;
                  this.statuscode = res['status'];
                  this.AllTfnnumber();
                  this.messageheader = res['message'];
                  setTimeout(() => { 
                    this.messageheader = "";
                  }, 5000);

                  this.resetpublisher();
                  this.resetfilter();
                  

                })              

              }

            })

          }else{
            this.AllTfnnumber();
            this.messageheader = 'Somthing went wrong TFN not Updated';
            setTimeout(() => { 
              this.messageheader = "";
            }, 5000);

          }

        })

      }else{

        this.service.deleteTFN(this.TFN.controls.id.value).subscribe((res: Response) => {
          this.statuscode = res['status'];
    
          if (this.statuscode == 'success') {

            this.service.getTFN(tfnsubmit).subscribe((res: Response) => {
              this.add = !this.add;
              this.loading = false;
              this.submitbutton = true;
              this.statuscode = res['status'];

              this.AllTfnnumber();
              this.messageheader = res['message'];
              setTimeout(() => { 
                this.messageheader = "";
              }, 5000);

              this.resetpublisher();
              this.resetfilter();

            })   
            
          }else{
            this.AllTfnnumber();
            this.messageheader = 'Somthing went wrong TFN not Updated';
            setTimeout(() => { 
              this.messageheader = "";
            }, 5000);

          }

        })

      }


    }


  }


  //Delete Tfn Number
  delete(id, tfn,status) {
    
        if(status=='used'){
          this.service.deleteTfnFreepbx(tfn).subscribe((clinetRes: Response) => {
            //  console.log(res);
            if(clinetRes['statusCode']=="200"){
              this.service.deleteTFN(id).subscribe((res: Response) => {
                this.statuscode = res['status'];
                this.toastr.success("TFN",'Tfn Successfully Deleted')
                if (this.statuscode == 'success') {
                  this.data.splice( this.data.findIndex(data=>data.tfn==tfn),1)
                }else{
                  this.toastr.error("TFN",'Somthing Went Wrong ')
                }
              })
            }else{
              this.toastr.error("TFN",'Somthing Went Wrong')
            }
            
            this.campignservice.getQueueRelod().subscribe((resdat: Response) => {
              //console.log(resdat); 
  
            })
          })
        }else{
          this.service.deleteTFN(id).subscribe((res: Response) => {
            this.statuscode = res['status'];
      
            if (this.statuscode == 'success') {
              this.data.splice( this.data.findIndex(data=>data.tfn==tfn),1)
              this.toastr.success("TFN",'Tfn Successfully Deleted')
            }else{
              this.toastr.error("TFN",'Somthing Went Wrong')
            }
          });
        }
      


 
  }
  getall(array) {
    array.sort((a: any, b: any) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;

  }
  //========================================= End Of Tfn ===================================================

  setpublisher: boolean = false;
  clicksetpublisher() {
    // alert();
    this.setpublisher = !this.setpublisher;
  }
  //========================================= Filter Details================================================ 
  status: boolean = false;
  clickFilter() {
    // alert();
    this.status = !this.status;
  }



  selectedFilter: string = '';

  filtr1: boolean = false;
  filtr2: boolean = false;
  filtr3: boolean = false;
  filtr4: boolean = false;
  filtr5: boolean = false;
  filtr6: boolean = false;
  filtr7: boolean = false;

  selectChangeFilter(event: any) {
    //update the ui
    let optlent = event.target.options.length;
    let text = event.target.options.selectedIndex;
    this.selectedFilter = event.target.value;

    for (let i = 1; i < optlent; i++) {
      // console.log(this.fliterList[i-1]);
      let statIndx = "filtr" + i;

      if (i == text) {
        console.log(statIndx);
        this[statIndx] = true;
      } else {

        // this[statIndx] = false;
      }
    }

  }

  filter(data1, event) {

    if (event.target.value != '') {
      if (data1 == "Name") {

        this.data = this.data.filter(res => {
          return res.publisherName.toLowerCase().match(event.target.value.toLowerCase())
        });
      }
      if (data1 == "Number") {
        this.data = this.data.filter(res => {
          return res.tfn.toLowerCase().match(event.target.value.toLowerCase())
        });
      }
      if (data1 == "Price") {
        this.data = this.data.filter(res => {
          return res.price_per_tfn.toString().match(event.target.value.toString())
        });
      }
      if (data1 == "Status") {
        this.data = this.data.filter(res => {
          return res.status.toLowerCase().match(event.target.value.toLowerCase())
        });

      }
    } else {
      this.AllTfnnumber();
    }
  }
  statusname: any
  pub_name_show:any;
  closefiltr(num) {
    // this[num] = false;
    console.log(this[num])
    if (num == 'filtr1') {
      this.number = '';
    }
    if (num == 'filtr2') {
      this.pub_name_show = '';
    }
    if (num == 'filtr3') {
      this.price = '';
    }
    if (num == 'filtr4') {
      this.statusname = '';
    }

  }
 
  unAssign(tfn) {

    // if(this.data.findIndex(data=>data.tfn==tfn)!=-1){
    //   let data= this.data.find(data=>data.tfn==tfn)
    //   console.log(data);
    //   let data1 = {
    //     'tfn': data.tfn,
    //     'publisherName':data.publisherName,
    //     'purchase_date': data.purchase_date,
    //     'price_per_tfn': data.price_per_tfn,
    //     'status':"available",
    //     'pub_id': data.pub_id,
    //     '_id': data._id,
    //     'created_at':data.created_at,
    //     'isSelected':false
    //   }
    //   console.log(this.data.findIndex(data=>data.tfn==tfn));
    //   console.log(data1);
    //   this.data.splice(this.data.findIndex(data=>data.tfn==tfn),1,data1);
    //  }
    //  return;
    this.service.getUnsignTfn(tfn).subscribe((res: Response) => {
      console.log(res);
      if (res['statusCode'] == "200") {

        let tfnsend = {
          'tfn': [tfn],
          'status': 'available',
        }
        this.service.postTfnStatus(tfnsend).subscribe((res: Response) => {
          if (res['statusCode'] == "200") {
            this.toastr.success('Status', 'Publisher SucessFully added');
            // if(this.data.findIndex(data=>data.tfn==tfn)!=-1){
            //  let data= this.data.find(data=>data.tfn==tfn)
            //  console.log(data);
            // }
             this.AllTfnnumber();

          }

        })

      } else {
        //console.log('no');
      }

    })
  }
  resetpublisher() {
    this.publisherdropdown = "Select Publisher"
  }
  resetfilter() {
    this.number = '';
    this.price = '';
    this.statusname = '';
    this.pub_name_show='';
  }
  filterall(filterValue: string) {
    if (filterValue != '') {
      this.data = this.data.filter(res => {
        return res.tfn.toLowerCase().match(filterValue.toLowerCase()) || res.publisherName.toLowerCase().match(filterValue.toLowerCase())
      });
    } else {
      this.AllTfnnumber();
    }
    //   filterValue = filterValue.trim(); // Remove whitespace
    //   filterValue = filterValue.toLowerCase(); // MatTableDataSource 
    //   this.data.filter = filterValue

    // //  let filterValue=event.target.value.toLocaleLowerCase();
    // this.data.filter = filterValue.toLowerCase();

    //   //this.data.filter(s => s.includes(filterValue));
    //   console.log(this.data);
    //   this.data=this.data.filter(element => {
    //     console.log(element)
    //     return element.toLocaleLowerCase().indexOf(filterValue)!==-1;
    //   });
  }

  //===============================================End of Filter Details=====================================
  isAllSelected() {

    this.masterSelected = this.data.every(function(user:any) {
        return user.isSelected == true;
      })
    this.getCheckedItemList();
  }
  getCheckedItemList(){
    this.checkedList = [];
    // this.checkedList= this.data.map(({isSelected,tfn})=>{
    //   if(isSelected){      
    //     return tfn
    //  }
    // })
    for (var i = 0; i < this.data.length; i++) {
      if(this.data[i].isSelected)
      this.checkedList.push(this.data[i].tfn);
    }
    this.countCheck=this.checkedList.length;
  // console.log(this.checkedList)
  }
  checkUncheckAll() {
    if (this.data && this.data.length) {
     
      
      let data=this.data.filter(item => {
        let pub=+this.publisherdropdown;
        //console.log(pub)
        if (pub && item.pub_id.toString().indexOf(pub.toString()) === -1 && this.publisherdropdown != "Select Publisher") {
         // console.log(pub)
          return false;
        }
    
        if (this.number && item.tfn.toLowerCase().indexOf(this.number.toLowerCase()) === -1) {
          
          return false;
        }
        if (this.pub_name_show && item.publisherName.toString().indexOf(this.pub_name_show.toString()) === -1) {
          return false;
        }
        if (this.price && item.price_per_tfn.toString().indexOf(this.price.toString()) === -1) {
          return false;
        }
        if (status && item.status.toString().indexOf(status.toString()) === -1) {
          return false;
        }
      
        // if (selected.startDate) {
   
        //   const curr = new Date(item.created_at);
        //   console.log(curr);
        //   return curr >= new Date(selected.startDate._d) && curr <= new Date(selected.endDate._d);
        // }
        
        return true;
      });
      this.checkedList=[]
      for (var i = 0; i < data.length; i++) {
        data[i].isSelected = this.masterSelected;
      }
      for (var i = 0; i < data.length; i++) {
        if(data[i].isSelected){
          console.log(data[i])
          this.checkedList.push(data[i].tfn);
        }
       
      }
      this.countCheck=this.checkedList.length;
     //console.log(this.checkedList)
      //this.getCheckedItemList();
    }
  
  }
  deletepart(){
   
    if(this.checkedList.length>0){

      this.service.deleteTfnMultipuleFreepbx(this.checkedList).subscribe((clientRes:any)=>{
        if(clientRes['statusCode']=="200"){
     
        this.service.deleteTfnMultiple(this.checkedList).subscribe((res:any)=>{
          if(res['statusCode']=="200"){
            this.toastr.success('Tfn','Tfn Successfully Deleted')
    
            this.checkedList.map((currElement, index) => {
            this.data.splice( this.data.findIndex(data=>data.tfn==currElement),1)
            
            });
          }else{
            this.toastr.error("TFN",'Somthing Went Wrong')
          }
       
       
      })
    }else{
      this.toastr.error("TFN",'Somthing Went Wrong')
    }
    })

    }else{
      this.toastr.warning('CheckBox', 'Please Select Check Box');
      //alert("Please Select Check Box")
    }
    
  }
}