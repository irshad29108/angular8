import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiBaseUrl;
  httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
  }
  // getAllWeakReport():Observable<any>{
  //   return this.http.get(`${this.apiURL}/cdr/weeklyReport`,this.httpOptions)
  // }
  getReport(camp,pub):Observable<any>{
    
    let publisher='';
    let campaign=''
    if(pub =='Select Publisher'|| pub==''){
      publisher=''
    }else{
      publisher=pub;
    }
    if(camp =='Select Publisher' || camp==''){
      campaign=''
    }else{
      campaign=camp;
    }
    return this.http.get(`${this.apiURL}/cdr/weeklyReport?pub_id=`+publisher+`&camp_id=`+campaign,this.httpOptions)
  }
  getHourlyReport(camp,pub):Observable<any>{
    let publisher='';
    let campaign=''
    if(pub =='Select Publisher'|| pub==''){
      publisher=''
    }else{
      publisher=pub;
    }
    if(camp =='Select Campaign' || camp==''){
      campaign=''
    }else{
      campaign=camp;
    }
    return this.http.get(`${this.apiURL}/cdr/hourlyReport?pub_id=`+publisher+`&camp_id=`+campaign ,this.httpOptions)
  }
  getMonthlyReport(camp,pub):Observable<any>{
    let publisher='';
    let campaign=''
    if(pub =='Select Publisher'|| pub==''){
      publisher=''
    }else{
      publisher=pub;
    }
    if(camp =='Select Campaign' || camp==''){
      campaign=''
    }else{
      campaign=camp;
    }
    return this.http.get(`${this.apiURL}/cdr/monthlyReport?pub_id=`+publisher+`&camp_id=`+campaign,this.httpOptions)
  }
}
