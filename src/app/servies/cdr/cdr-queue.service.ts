import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CdrQueueService {


  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiBaseUrl;
  //apiURL: string = environment.apiDirectUrl;
   httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
  }
  getAllQueueCdr(pub,queue_id,startTime,endTime):Observable<any>{
   
    let date={"sdate": startTime, "edate": endTime,"dst":queue_id}
    //let date={"sdate": startTime, "edate": endTime,"pub_id":pub}
    return this.http.post(`${this.apiURL}/queueReport`,date,this.httpOptions);

  }
  getQueueNumber():Observable<any>{
    return this.http.get(`${this.apiURL}/QueueNumbers/getAllQueueNumbers`,this.httpOptions);
  }
  getAllUniqueCalls(first,last,Pub_id ,number):Observable<any>{
    if(Pub_id!=''){
      
      return this.http.get(`${this.apiURL}/getTotalUniqueCalls/`+first+`/`+ last+`?queueNumber=`+number+`&pub_id=`+Pub_id,this.httpOptions);
    }else{
      return this.http.get(`${this.apiURL}/getTotalUniqueCalls/`+first+`/`+ last,this.httpOptions);
    }
    
  }
  getUniqueAnsCalls(first,last,Pub_id,number):Observable<any>{
    if(Pub_id!=''){
    return this.http.get(`${this.apiURL}/getTotalUniqueAnsweredCalls/`+first+`/`+ last+`?queueNumber=`+number+`&pub_id=`+Pub_id,this.httpOptions);
    }else{
      return this.http.get(`${this.apiURL}/getTotalUniqueAnsweredCalls/`+first+`/`+ last,this.httpOptions);
    }
  }
  getAHT(startTime,endTime,pub_id,queu_id):Observable<any>{

    /*if(Pub_id!=''){
    return this.http.get(`${this.apiURL}/getAHT/`+first+`/`+ last+`?queueNumber=`+number+`&pub_id=`+Pub_id,this.httpOptions);
    }else{
      return this.http.get(`${this.apiURL}/getAHT/`+first+`/`+ last,this.httpOptions);
    }*/
    var data;
    if(pub_id ==''){
      data ={"sdate": startTime, "edate": endTime}
    }else if(pub_id == -1){
       data ={"sdate": startTime, "edate": endTime,"dst":queu_id}
    }else{
      data ={"sdate": startTime, "edate": endTime,"pub_id": pub_id}
    }
    return this.http.post(`${this.apiURL}/getAHT`,data,this.httpOptions);

  }

  
}
