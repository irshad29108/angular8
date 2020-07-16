import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class LoginService {

  
  constructor(private router:Router,private http: HttpClient) {
    
        
    
   }
  apiURL: string = environment.apiBaseUrl;
  postLigin(login):Observable<any>{
    //console.log(login);
    const httpOptions = {
      headers: new HttpHeaders({ 
       'Content-Type':'application/json'
      })
      
    };
  return this.http.post<any>(`${this.apiURL}/user/login`,login,httpOptions)
 }
 postRecovery(recovery):Observable<any>{
  const httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json'
    })
    
  };
return this.http.post<any>(`${this.apiURL}/user/recoveryPassword`,recovery,httpOptions)
 }

 postRestPassword(id,details):Observable<any>{
  const httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
  }
   return this.http.put<any>(`${this.apiURL}/user/updatePassword/`+id,details,httpOptions)
 }
 
//  public get currentUserValue() {
//   console.log(this.token);
  
//   return this.token
//  }

}

