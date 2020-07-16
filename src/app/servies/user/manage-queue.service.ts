import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageQueueService {

  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiBaseUrl;
  apiFreepbx=environment.apiDirectUrl;
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
  postQueue(queue):Observable<any>{
    return this.http.post(`${this.apiURL}/queue`,queue,this.httpOptions);
  }
  getQueue():Observable<any>{
    return this.http.get(`${this.apiURL}/queue/getQueue`,this.httpOptions)
  }
  getQueueById(id):Observable<any>{
    return this.http.get(`${this.apiURL}/queue/getQueue/`+id,this.httpOptions)
  }
  postQueueByID(id,queue):Observable<any>{
    return this.http.post(`${this.apiURL}/queue/editQueue/`+id,queue,this.httpOptions)
  }
  deleteQueue(id):Observable<any>{
    return this.http.delete(`${this.apiURL}/queue/deleteQueue/`+id,this.httpOptions)
  }
  getQueueNumber():Observable<any>{
    return this.http.get(`${this.apiURL}/QueueNumbers/getAllQueueNumbers`,this.httpOptions)
  }
  postQueueNumberFreepbx():Observable<any>{
    let data={"token": "ymzfMNQVp3yateWs"}
    return this.http.post(`${this.apiFreepbx}/pbxapis/NodeApis/getQueues`,data,this.httpOptions)
  }
  getQueueNumberByPubId(id):Observable<any>{
    return this.http.get(`${this.apiURL}/queue/getQueueByPubId/`+ id,this.httpOptions)
  }
  getQueueNumberByQueueId(id):Observable<any>{
    return this.http.get(`${this.apiURL}/QueueNumbers/getQueueNumber/`+ id,this.httpOptions)
  }
  postAddQueueNumber(number):Observable<any>{
    return this.http.post(`${this.apiURL}/QueueNumbers/add`,number,this.httpOptions)
  }
  deleteQueueNumber(id):Observable<any>{
    return this.http.delete(`${this.apiURL}/QueueNumbers/delete/`+id,this.httpOptions)
  }
}
