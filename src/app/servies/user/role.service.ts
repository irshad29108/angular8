import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiBaseUrl;
  httpOptions = {
   headers: new HttpHeaders({ 
    'Content-Type':'application/json',
    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
   })
   
     
 };
 getRole():Observable<any>{
   return this.http.get(`${this.apiURL}/role/getRoles`,this.httpOptions);
 }
 postAddRole(role):Observable<any>{
   return this.http.post(`${this.apiURL}/role`,role,this.httpOptions)
 }
 deleteRole(id):Observable<any>{
   return this.http.delete(`${this.apiURL}/role/deleteRole/`+id,this.httpOptions)
 }
}
