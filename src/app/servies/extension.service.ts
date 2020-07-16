import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ExtensionService {

  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiBaseUrl;
  apiFree: string = environment.apiDirectUrl;
   httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
  }
  httpOptions2 = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     
    })
  }
  postAllExtByQueue(Queue):Observable<any>{
    let queue={"queue":Queue}
    return this.http.post(`${this.apiFree}/pbxapis/NodeApis/showInsideMember`,queue,this.httpOptions2);
  }
  postAddExt(Queue):Observable<any>{
    return this.http.post(`${this.apiFree}/pbxapis/NodeApis/addInsideMember`,Queue,this.httpOptions);
  }
  deleteExtByQueue(Ext,Queue):Observable<any>{
    let queue={"queue":Queue, "extensions": [Ext]}
    return this.http.post(`${this.apiFree}/pbxapis/NodeApis/delInsideMember`,queue,this.httpOptions);
  }
}
