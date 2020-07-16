import { Component, OnInit } from '@angular/core';
import { TfnService } from 'src/app/servies/user/tfn.service';
import { ActiveHourService } from 'src/app/servies/active-hour.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from "jquery";
import { AmazingTimePickerService } from 'amazing-time-picker';
import { ManageBuyersService } from 'src/app/servies/user/manage-buyers.service';
@Component({
  selector: 'app-active-buyer-hour',
  templateUrl: './active-buyer-hour.component.html',
  styleUrls: ['./active-buyer-hour.component.css']
})
export class ActiveBuyerHourComponent implements OnInit {

  constructor(public service: ManageBuyersService, public activservice: ActiveHourService, private formBuilder: FormBuilder, private atp: AmazingTimePickerService) { }
  public popoverTitle: string = 'Title';
  public popoverMessage: string = 'Are you really sure you want to do this?';
  public popoverClass: string = 'custompop';
  loading = false;
  submitbutton = true
  alluser: any;
  dataactive: any;
  ActiveHour: FormGroup;
  submitted: boolean;
  statuscode: any;
  messageheader: any;
  messageheadererror: any;
  data: any;
  datatfn: any = [];
  ngOnInit() {
    this.addhourform();
    this.allActiveServices();
    this.AllTfnnumber();
    this.alluser = JSON.parse(localStorage.getItem('username'));
  }
  addhourform() {
    this.ActiveHour = this.formBuilder.group({
      // day: [this.editdata.day, Validators.required],
      number: [this.editdata.number, Validators.required],
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
    // this.showmethod="loading"

    this.service.getBuyerNumberByid().subscribe((res: Response) => {
      this.service.getAllBuyers().subscribe((response: Response) => {
        if (this.alluser == 'admin') {
          this.datatfn = res['buyerNumber'];
          for (var j of res['buyerNumber']) {
            let data = {
              'number': j.number
            }
            this.datatfn.push(data);
          }
        } else {
          for (var i of response['buyers']) {
            for (var j of res['buyerNumber']) {
              if (j.buyer_id == i.buyer_id) {
                let data = {
                  'number': j.number
                }
                this.datatfn.push(data);
              }
            }
          }
        }

      })

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
    this.activservice.getAllBuyerActiveHour().subscribe((res: Response) => {
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
      let alldata = {
        // 'day':this.ActiveHour.controls.day.value,
        'number': this.ActiveHour.controls.number.value,
        // 'destination':'ext-queues,3,1',
        'active_on': this.ActiveHour.controls.open_hour.value,
        'active_off': this.ActiveHour.controls.close_hour.value,
      }
      console.log(alldata);
      this.activservice.postAddBuyerActiveHour(alldata).subscribe((res: Response) => {
        this.statuscode = res['status'];
        this.loading = false;
        this.submitbutton = true;
        this.add = !this.add;
        if (this.statuscode == 'success') {

          this.messageheader = "Buyer Active Hour Added SuccessFully";
          setTimeout(() => {
            this.messageheader = "";

          }, 5000);
        } else {
          this.messageheadererror = "Error to buyer adding Active hour ";
          setTimeout(() => {
            this.messageheadererror = "";
          }, 5000);
        }
        console.log(res);
        this.allActiveServices();

      })
    } else {
      let data = {
        'number': this.ActiveHour.controls.number.value,
        'active_on': this.ActiveHour.controls.open_hour.value,
        'active_off': this.ActiveHour.controls.close_hour.value,
      }
      //  console.log(data);return;
      this.activservice.updateBuyerActiveHourById(this.ActiveHour.controls.id.value, data).subscribe((res: Response) => {
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
    this.activservice.getBuyerActiveHourById(id).subscribe((res: Response) => {
      console.log(res);
      this.add = !this.add;
      this.editdata = res['activeHours'][0]
      this.addhourform();
    })
  }
  delete(id) {
    this.activservice.deleteBuyerActiveHour(id).subscribe((res: Response) => {
      console.log(res);
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

}
