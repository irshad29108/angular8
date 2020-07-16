import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiveService {

  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiBaseUrl;
  apiFree: string = environment.apiDirectUrl;
   httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
  }
  // getLive():Observable<any>{
  //   return this.http.get(`${this.apiURL}/getTotalCdrs`,this.httpOptions);
  // }http://199.195.146.52/pbxapis/NodeApis/livecalls
  detail(id){
    this.getLive(id);
    this.getComplete(id)
  }
  getLive(data):Observable<any>{
    return this.http.get(`${this.apiFree}/pbxapis/NodeApis/livecalls1`+data);
  }
  getComplete(data):Observable<any>{
    return this.http.get(`${this.apiURL}/getTotalCdrs`+data,this.httpOptions);
  }

}
