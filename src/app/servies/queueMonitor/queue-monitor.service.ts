import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class QueueMonitorService {

  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiBaseUrl;
  freePbx:string=environment.apiDirectUrl;
   httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
  }
  getallmonitor(number):Observable<any>{
    return this.http.get<any>(`${this.freePbx}/pbxapis/NodeApis/get_details_new?queue=`+number,this.httpOptions);
    
  }
  getAllWatingCall(queue):Observable<any>{
    return this.http.get(`${this.freePbx}/pbxapis/NodeApis/waiting_calls?queue=`+queue,this.httpOptions);
  }
}
