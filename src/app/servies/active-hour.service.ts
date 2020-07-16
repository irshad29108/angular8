import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AmazingTimePickerService } from 'amazing-time-picker';
@Injectable({
  providedIn: 'root'
})
export class ActiveHourService {

  constructor(private router:Router,private http: HttpClient,) { }
  apiURL: string = environment.apiBaseUrl;
  apiFree: string = environment.apiDirectUrl;
   httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
  }

  getTfnqueNumber(tfn):Observable<any>{
    return this.http.get(`${this.apiURL}/freepbxTfn?tfn=`+tfn,this.httpOptions);
  }

  getAllActiveHour():Observable<any>{
    return this.http.get(`${this.apiURL}/ActiveHours/getAll`,this.httpOptions);
  }
  postAddActiveHour(data):Observable<any>{
    return this.http.post(`${this.apiURL}/ActiveHours/add`,data,this.httpOptions)
  }
  getActiveHourById(id):Observable<any>{
    return this.http.get(`${this.apiURL}/ActiveHours/getActiveHour/`+id,this.httpOptions)
  }
  updateActiveHourById(id,data):Observable<any>{
    return this.http.put(`${this.apiURL}/ActiveHours/update/`+id,data,this.httpOptions)
  }
  deleteActiveHour(id):Observable<any>{
    return this.http.delete(`${this.apiURL}/ActiveHours/delete/`+id,this.httpOptions)
  }
  getAllBuyerActiveHour():Observable<any>{
    return this.http.get(`${this.apiURL}/BuyerActiveHours/getAll`,this.httpOptions);
  }
  postAddBuyerActiveHour(data):Observable<any>{
    return this.http.post(`${this.apiURL}/BuyerActiveHours/add`,data,this.httpOptions)
  }
  getBuyerActiveHourById(id):Observable<any>{
    return this.http.get(`${this.apiURL}/BuyerActiveHours/getActiveHour/`+id,this.httpOptions)
  }
  updateBuyerActiveHourById(id,data):Observable<any>{
    return this.http.put(`${this.apiURL}/BuyerActiveHours/update/`+id,data,this.httpOptions)
  }
  deleteBuyerActiveHour(id):Observable<any>{
    return this.http.delete(`${this.apiURL}/BuyerActiveHours/delete/`+id,this.httpOptions)
  }
  
}
