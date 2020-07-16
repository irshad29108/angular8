import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  constructor(private router:Router,private http: HttpClient,) { }
  apiURL: string = environment.apiBaseUrl;
  apiFree: string = environment.apiDirectUrl;
   httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
  }
  
  updatemail(id,data):Observable<any>{
    return this.http.post(`${this.apiURL}/smtp/updateSmtp/`+id,data,this.httpOptions);
  }
  getmail():Observable<any>{
    
    return this.http.get(`${this.apiURL}/smtp/getSmtp`,this.httpOptions);
  }
}
