import { Component, OnInit } from '@angular/core';
import { TfnService } from 'src/app/servies/user/tfn.service';
import { ActiveHourService } from 'src/app/servies/active-hour.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import * as $ from "jquery";
import { AmazingTimePickerService } from 'amazing-time-picker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-active-hours',
  templateUrl: './active-hours.component.html',
  styleUrls: ['./active-hours.component.css']
})
export class ActiveHoursComponent implements OnInit {
  data: any;
  datatfn: any;
  public publisher_TFN: Array<Select2OptionData>;
  loading = false;
  submitbutton = true;
  constructor(public service: TfnService, public activservice: ActiveHourService, private formBuilder: FormBuilder, private atp: AmazingTimePickerService,private route:Router) { }
  alluser: any;
  dataactive: any;
  ActiveHour: FormGroup;
  submitted: boolean;
  public popoverTitle: string = 'Title';
  public popoverMessage: string = 'Are you really sure you want to do this?';
  public popoverClass: string = 'custompop';
  statuscode: any;
  messageheader: any;
  messageheadererror: any;
  ngOnInit() {
    this.addhourform();
    this.allActiveServices();

    this.AllTfnnumber();
    this.alluser = JSON.parse(localStorage.getItem('username'));
    
    if(!this.alluser){
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      this.route.navigate(['login']);
    }
  }
  addhourform() {
    this.ActiveHour = this.formBuilder.group({
      day: [this.editdata.day, Validators.required],
      tfn: [this.editdata.tfn, Validators.required],
      open_hour: [this.editdata.active_on, Validators.required],
      close_hour: [this.editdata.active_off, Validators.required],
      id: [this.editdata._id],
    })
  }
  get active() {
    return this.ActiveHour.controls;
  }
  AllTfnnumber() {
    this.data = [];
    var localTfn =[];
    // this.showmethod="loading"
    this.service.getAllTFN().subscribe((res: Response) => {

      this.datatfn = res['tfn'];

      for(var i of res['tfn']){
        let data={
          'id':i.tfn,
          'text':i.tfn
        }
        localTfn.push(data)
      }
      this.publisher_TFN=localTfn;

      //console.log(this.publisher_TFN);

    });
  }
  add = false;
  clickadd() {
    // alert();
    this.ActiveHour.reset();
    this.add = !this.add;
  }
  showmethod1 = '';

  allActiveServices() {
    this.showmethod1 = 'loading'
    this.activservice.getAllActiveHour().subscribe((res: Response) => {
      this.dataactive = res['activeHours'];
      if (this.dataactive == '') {
        this.showmethod1 = "no data";
      } else {
        this.showmethod1 = "";
      }
    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.ActiveHour.invalid) {
      return;
    }
    this.loading = true;
    this.submitbutton = false;
    //console.log(this.ActiveHour);return;
    if (this.ActiveHour.controls.id.value == undefined || this.ActiveHour.controls.id.value == null || this.ActiveHour.controls.id.value == '') {

      this.activservice.getTfnqueNumber(this.ActiveHour.controls.tfn.value).subscribe((res: Response) => {


          if(res['statusCode'] == '200'){

            if(res['message'][0]['campaigndata']!= undefined){
              
                var alldata = {
                    'day': this.ActiveHour.controls.day.value,
                    'tfn': this.ActiveHour.controls.tfn.value,
                    'destination': 'ext-queues,'+res['message'][0]['campaigndata']['queue_no']+',1',
                    'active_on': this.ActiveHour.controls.open_hour.value,
                    'active_off': this.ActiveHour.controls.close_hour.value,
                  }
                  
                this.activservice.postAddActiveHour(alldata).subscribe((res: Response) => {

                  this.statuscode = res['status'];
                  // this.loading = false;
                  // this.submitbutton = true;
                  // this.add = !this.add;
                  if (this.statuscode == 'success') {

                    this.messageheader = "Active Hour Added SuccessFully";
                    setTimeout(() => {
                      this.messageheader = "";

                    }, 5000);

                  } else {

                    this.messageheadererror = "Error to adding Active Hour ";
                    setTimeout(() => {
                      this.messageheadererror = "";
                    }, 5000);

                  }
                  this.allActiveServices();
                })
          }else{
              this.messageheadererror = "Erro: no compaign found" ;
              setTimeout(() => {
                this.messageheadererror = "";
              }, 5000);
          }
        

        }else{
          
          this.messageheadererror = "Erro: Que number not found" ;
            setTimeout(() => {
              this.messageheadererror = "";
            }, 5000);

        }

        this.loading = false;
        this.submitbutton = true;
        this.add = !this.add;

      })





    } else {
      let data = {
        'active_on': this.ActiveHour.controls.open_hour.value,
        'active_off': this.ActiveHour.controls.close_hour.value,
      }
      //  console.log(data);return;
      this.activservice.updateActiveHourById(this.ActiveHour.controls.id.value, data).subscribe((res: Response) => {
        console.log(res);
        this.statuscode = res['status'];
        this.loading = false;
        this.submitbutton = true;
        this.add = !this.add;
        if (this.statuscode == 'success') {

          this.messageheader = "Active Hour  SuccessFully Edited";
          setTimeout(() => {
            this.messageheader = "";

          }, 5000);
        } else {
          this.messageheadererror = "Error to Edited Active Hour ";
          setTimeout(() => {
            this.messageheadererror = "";
          }, 5000);
        }
        this.allActiveServices();

      })
    }
  }


  editdata: any = [];
  edit(id) {
    this.activservice.getActiveHourById(id).subscribe((res: Response) => {
      this.add = !this.add;
      this.editdata = res['activeHours'][0]
      this.addhourform();
    })
  }
  delete(id) {
    this.activservice.deleteActiveHour(id).subscribe((res: Response) => {
      this.statuscode = res['status'];
      if (this.statuscode == 'success') {

        this.messageheader = "Active Hour  SuccessFully Deleted";
        setTimeout(() => {
          this.messageheader = "";

        }, 5000);
      } else {
        this.messageheadererror = "Error to Deleted Active Hour ";
        setTimeout(() => {
          this.messageheadererror = "";
        }, 5000);
      }
      this.allActiveServices();
    })
  }

  onSearchChange(searchValue: string): void {
    console.log(searchValue);
  }

  toggleDisable() {

    this.atp.open({
      theme: 'material-blue',
    });
  }


}



