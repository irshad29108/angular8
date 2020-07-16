import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagePublisherService {

  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiBaseUrl;
   httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
    
  };
  httpOptions2 = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
    })
  }
  postManagePublisher(publisher):Observable<any>{
    
    return this.http.post(`${this.apiURL}/publisher`,publisher,this.httpOptions);
  }

  getManagePublisher():Observable<any>{

    return this.http.get(`${this.apiURL}/publisher/getPublishers`,this.httpOptions);
  }


  editManagePublisher(uid){ 
    return this.http.get(`${this.apiURL}/publisher/getPublisher/`+uid,this.httpOptions);
  }

  updateManagePublisher(publisher,uid):Observable<any>{
    return this.http.post(`${this.apiURL}/publisher/`+uid,publisher,this.httpOptions);
  }

  deleteManagePublisher(uid):Observable<any>{
    console.log(uid)
    return this.http.delete(`${this.apiURL}/publisher/deletePublisher/`+uid,this.httpOptions);
  }

  emailVarification(email):Observable<any>{
    let data={'email':email}
    return this.http.post(`${this.apiURL}/uniquePublisher`,data,this.httpOptions2);
  }
  putManageSetting(uid,setting):Observable<any>{
    return this.http.put(`${this.apiURL}/publisher/editPublisherSettings/`+uid,setting,this.httpOptions);
  }
  getManageSetting(uid):Observable<any>{
    return this.http.get(`${this.apiURL}/publisher/getPublisherSettings/`+uid,this.httpOptions);
  }
  postPublisherStatus(id,status):Observable<any>{
    return this.http.post(`${this.apiURL}/publisher/status/`+id,status,this.httpOptions);
  }
}
