import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from 'src/app/servies/user/login.service';
import { error } from '@angular/compiler/src/util';
import { ManagePublisherService } from 'src/app/servies/user/manage-publisher.service';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submiteddata:any= {};
  message: any;
  errormessage: any ='';
  error: any;
  emailmessage: string;
  statusemail = false;
  loading=false;
  token: any;
  constructor(public servics: LoginService, private formBuilder: FormBuilder, public router: Router, public publisherservice: ManagePublisherService,private titleService:Title) {
    this.titleService.setTitle("Routecent | Log In");
   }

  Login: FormGroup;
  Recovery: FormGroup;
  submitted = false;
  submitted1 = false;
  passtatus: boolean = false;
  rcoverymsg:any;

   forGot() {
     this.passtatus = !this.passtatus;
   }
  // public isLoggin = 'false';

  // doLogin() {
  //   localStorage.setItem('isLoggedin', 'true');
  //   this.isLoggin = localStorage.getItem('isLoggedin');
  // }


  ngOnInit() {
    this.Login = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role:['',Validators.required]
    })
    this.Recovery = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      role:['',Validators.required]
    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.Login.invalid) {
      return;
    }
    this.loading=true;
    // this.publisherservice.emailVarification(this.Login.controls.email.value).subscribe((res: Response) => {
     // console.log(res);
      // if (res['user'] == '' && res['user'].length == 0) {
      //   this.emailmessage = "Email Doesn't Exists";
      //   return;
      // } else {
       // this.emailmessage = "";
        this.submiteddata = {
          'username': this.Login.controls.username.value,
          'password': this.Login.controls.password.value,
          'role':this.Login.controls.role.value,
        }
        this.servics.postLigin(this.submiteddata).subscribe((res: Response) => {
          console.log(res);
           this.message = res;
          if (this.message.success == 'OK') {
            if(this.message.user.role=='monitor'){
              localStorage.setItem('username', JSON.stringify({ 'username': this.message.user.name, 'uid': this.message.user.queue_id ,'role':this.message.user.role,'name':this.message.user.name}));
            }else if(this.message.user.role=='buyer'){
              localStorage.setItem('username', JSON.stringify({ 'username': this.message.user.name, 'uid': this.message.user.buyer_id ,'role':this.message.user.role,'name':this.message.user.name}));
            }else{
              localStorage.setItem('username', JSON.stringify({ 'username': this.message.user.username, 'uid': this.message.user.uid ,'role':this.message.user.role,'name':this.message.user.fullname}));
            }
           
            localStorage.setItem('token', JSON.stringify(this.message.login_token));
            window.location.href ="";
            this.loading=false;
           
            
            
          } else {
             this.onlogginFaliure()
            
            // alert("Invalid credentials")
          }
        }
  
        );

    
    


  }
  messageshow:any='';
  messageerror:any='';
  onSubmitrev(){
    this.submitted1 = true;
    if (this.Recovery.invalid) {
      return;
    }
    this.servics.postRecovery(this.Recovery.value).subscribe((res:Response)=>{
      console.log(res);
      this.rcoverymsg=res;
      console.log(this.rcoverymsg.message);
      if(this.rcoverymsg.success!="NOK"){
        this.messageerror='';
        this.messageshow=this.rcoverymsg.message;
        
      }else{
        this.messageshow='';
        this.messageerror=this.rcoverymsg.message;
      }
    })
    console.log(this.Recovery);
  }
  onlogginSuccess(){
    localStorage.setItem('username', JSON.stringify({ 'username': this.message.user.username, 'uid': this.message.user.uid ,'role':this.message.user.role,'name':this.message.user.fullname}));
            localStorage.setItem('token', JSON.stringify(this.message.login_token));
            location.reload(true);
            //window.location.href ="";
    this.loading=false;
  }
  onlogginFaliure(){
    this.errormessage = "Invalid credentials";
    this.loading=false;
  }

  get f() { return this.Login.controls; }
  get f1() { return this.Recovery.controls; }
}

