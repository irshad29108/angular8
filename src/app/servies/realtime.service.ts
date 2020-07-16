import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiDirectUrl;
   httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
    //  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
     //'token':'token=r3ByrH3W1U01dKvL '
    })
  }
  getAllRealTime(id):Observable<any>{
    // let token={'token':'r3ByrH3W1U01dKvL','pub_id':id}
    return this.http.post(`${this.apiURL}/pbxapis/NodeApis/realtime`,id,this.httpOptions);
  }

  getcallHangup(channel):Observable<any>{
    let data={'channel':channel}
    return this.http.post(`${this.apiURL}/pbxapis/NodeApis/hangup`,data,this.httpOptions);
  }

  getAllRealTimeTFN(id):Observable<any>{
    return this.http.get(`${this.apiURL}/pbxapis/NodeApis/tfn_realtime`,this.httpOptions);
  }

  getAllRealTimeBuyer(id):Observable<any>{
    return this.http.get(`${this.apiURL}/pbxapis/NodeApis/buyer_realtime`,this.httpOptions);
  }

  


}
