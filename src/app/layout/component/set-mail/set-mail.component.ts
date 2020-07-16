import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MailService } from 'src/app/servies/mail.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-set-mail',
  templateUrl: './set-mail.component.html',
  styleUrls: ['./set-mail.component.css']
})
export class SetMailComponent implements OnInit {

  constructor(public formBuilder:FormBuilder,public service:MailService,private toastr: ToastrService) { }
  ManageMail: FormGroup;
  submitted=false
  editmail:any=[];
  loading1:false;
  ngOnInit() {
    this.mailForm();
    this.service.getmail().subscribe((res:Response)=>{
      console.log(res);
      this.editmail=res['smtp'];
      this.mailForm()
    })
  }
  mailForm() {
    this.ManageMail = this.formBuilder.group({
      // campany_name: ['', Validators.required],
      // email_address: ['', [Validators.required, Validators.email]],
      // resv_email_address: ['', [Validators.required, Validators.email]],
      // toll_free_number: ['', Validators.required],
      // contact: ['', Validators.required],
      // brand_name: ['', Validators.required],
      // website_url: ['', Validators.required],
      // address: ['', Validators.required],
      mail_driver: [this.editmail.driver, Validators.required],
      mail_host: [this.editmail.host, Validators.required],
      mail_port: [this.editmail.port, Validators.required],
      mail_username: [this.editmail.username, Validators.required],
      mail_password: [this.editmail.password, Validators.required],
      addtional_db_time: [this.editmail.db_time, Validators.required],
     
    });
  }
  get mailerror(){
   return this.ManageMail.controls;
  }
  onSubmit(){
    console.log(this.ManageMail.value);
    this.submitted=true;
    if(this.ManageMail.invalid){
      return;
    }
    let detail={
      'driver':this.ManageMail.controls.mail_driver.value,
      'db_time':this.ManageMail.controls.addtional_db_time.value,
      'host':this.ManageMail.controls.mail_host.value,
      'password':this.ManageMail.controls.mail_password.value,
      'port':this.ManageMail.controls.mail_port.value,
      'username':this.ManageMail.controls.mail_username.value,
    }
    this.service.updatemail(1,detail).subscribe((res:Response)=>{
      console.log(res);
      if(res['statusCode']=="200"){
        this.toastr.success('Status','Mail Smtp added');
        this.ManageMail.reset();
        this.submitted=false;
      }else{
        this.toastr.error('Error',res['message'])
      }
    })

  }
  cancel(){
    this.submitted=false;
    this.ManageMail.reset();
  }

}
