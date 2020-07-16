import { Injectable } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsageService {

  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiBaseUrl;
  apiFree: string = environment.apiDirectUrl;
  httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
  }
  getUsageModule(id,startDate,endDate):Observable<any>{
    let publisher={'pub_id':id}
    return this.http.post(`${this.apiURL}/usagereport/`+startDate+'/'+endDate,publisher,this.httpOptions);
  }
}
