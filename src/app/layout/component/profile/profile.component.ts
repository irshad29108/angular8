import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/servies/user/login.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public object : any;
  ForgetPassword:FormGroup;
  constructor( public service:LoginService, public formBuilder: FormBuilder) { }
  alluser:any 
  submitted=false;
  isshow=false;
 
objectt:any=[]
MustMatch(controlName: string, matchingControlName: string) {
    return (ForgetPassword: FormGroup) => {
      const control = ForgetPassword.controls[controlName];
      const matchingControl = ForgetPassword.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  ngOnInit() {
	
	this.alluser = JSON.parse(localStorage.getItem('username'))
	this.objectt = {

		firstname:this.alluser.name,
		lastname: 'singh',
		email: 'anil.singh581@gmail.com',
		age :'34', 
		address:'Noida, UP, India',
		phone: '9876543210',
		shift: '3AM - 12PM',
		reportingTo: 'Super admin',
		extensionId: '1006',
		joiningDate: '01-05-2019',
		department: 'Tech Support',
		role:this.alluser.role
	};
	if(this.alluser.role=='admin' || this.alluser.role=="publisher"){
		this.isshow=true;
	}
	this.ForgetPassword = this.formBuilder.group({
		current:['', Validators.required],
		password: ['', [Validators.required, Validators.minLength(6)]],
		confirmPassword: ['', Validators.required],
	
	}, {
        validator: this.MustMatch('password', 'confirmPassword'),

      })
  }
   get f(){
	   return this.ForgetPassword.controls;
   }
   onSubmit(){
	this.submitted = true;
    if (this.ForgetPassword.invalid) {
      return;
	}
	let submit={
		'old_passwd':this.ForgetPassword.controls.current.value,
		'passwd':this.ForgetPassword.controls.password.value,
		'role':this.alluser.role,
	}
	this.service.postRestPassword(this.alluser.uid,submit).subscribe((res:Response)=>{
		// console.log(res);
		
		alert(res['message']);
		
		//alert("Password Successfully updated ")
	})
	
   }


}
