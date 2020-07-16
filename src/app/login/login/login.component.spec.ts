import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginServiceMock } from 'src/test/mock/services/auth-service.mock';
import { LoginService } from 'src/app/servies/user/login.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports:[
        ReactiveFormsModule,
        RouterTestingModule,
        FormsModule,
        HttpClientTestingModule,
        
      ],
      providers:[
        {provide:LoginService, useClass:LoginServiceMock}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

   it('should create', () => {
     expect(component).toBeTruthy();
   });
   it('should Contain a defaultvalue For the login', () => {
    expect(component.Login.value).toEqual({username:"",password:''}) 
  });
   it('should login user if the form is valid and navigate to the dashboard', () => {
    
     component.Login.setValue({username:"admin@routecent.com",password:'123456'})
     spyOn(component,'onlogginSuccess')
     component.onSubmit();
     expect(component.onlogginSuccess).toHaveBeenCalled();
   });
   it('should not do the  login call if the form is not valid', () => {
    
    component.Login.setValue({username:'',password:''})
    spyOn(component,'onlogginFaliure')
    component.onSubmit();
    expect(component.onlogginFaliure).not.toHaveBeenCalled();
  });
});
