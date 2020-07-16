import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CdrService {

  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiBaseUrl;
  Freepbx: string = environment.apiDirectUrl;
   httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
  }
  getTotalCalls(first,last,data):Observable<any>{
    return this.http.get(`${this.apiURL}/getAllCdrs/`+first+`/`+ last+data,this.httpOptions);
  }
  getUniqueCalls(first,last,data):Observable<any>{
    return this.http.get(`${this.apiURL}/getTotalUniqueCalls/`+first+`/`+ last+data,this.httpOptions);
  }
  getTotalUniqueAnsCalls(first,last,data):Observable<any>{
    return this.http.get(`${this.apiURL}/getTotalUniqueAnsweredCalls/`+first+`/`+ last+data,this.httpOptions);
  }
  getAHT(pub_id,startTime,endTime,data,queu_id):Observable<any>{

    var data;
    if(pub_id ==''){
      data ={"sdate": startTime, "edate": endTime}
    }else if(pub_id == -1){
       data ={"sdate": startTime, "edate": endTime,"dst":queu_id}
    }else{
      data ={"sdate": startTime, "edate": endTime,"pub_id": pub_id}
    }
    return this.http.post(`${this.apiURL}/getAHT`,data,this.httpOptions);

    //return this.http.post(`${this.apiURL}/getAHT/`+first+`/`+ last+data,this.httpOptions);
  }
  getOutboundTotalCalls(pub_id,queu_id,startTime,endTime):Observable<any>{

    var data;
    if(pub_id ==''){
      data ={"sdate": startTime, "edate": endTime}
    }else if(pub_id == -1){
       data ={"sdate": startTime, "edate": endTime,"dst":queu_id}
    }else{
      data ={"sdate": startTime, "edate": endTime,"pub_id": pub_id}
    }
    //?buyerNumber=queu_no
    return this.http.post(`${this.apiURL}/getAllOutboundCdrs`,data,this.httpOptions);
  }
  getOutboundUniqueCalls(pub,first,last):Observable<any>{
    let id=''
    if(pub!=''){
      id=`?pub_id=`+pub;
    }
    return this.http.get(`${this.apiURL}/getTotalUniqueOutboundCalls/`+first+`/`+ last+id,this.httpOptions);
  }
  getOutboundTotalUniqueAnsCalls(pub,first,last):Observable<any>{
    let id=''
    if(pub!=''){
      id=`?pub_id=`+pub;
    }
    return this.http.get(`${this.apiURL}/getTotalUniqueAnsweredOutboundCalls/`+first+`/`+ last+id,this.httpOptions);
  }
  getOutboundAHT(pub_id,queu_id,startTime,endTime):Observable<any>{
   
   var data;
    if(pub_id ==''){
      data ={"sdate": startTime, "edate": endTime}
    }else if(pub_id == -1){
       data ={"sdate": startTime, "edate": endTime,"dst":queu_id}
    }else{
      data ={"sdate": startTime, "edate": endTime,"pub_id": pub_id}
    }
    return this.http.post(`${this.apiURL}/getOutboundAHT`,data,this.httpOptions);

  }
  PostBlockCid(data){
    
    return this.http.post(`${this.Freepbx}/pbxapis/NodeApis/block`,data,this.httpOptions);
  }
  PostUnBlockCid(data){
    return this.http.post(`${this.Freepbx}/pbxapis/NodeApis/unblock`,data,this.httpOptions);
  }
  PostBlockCidTfn(data){
    return this.http.post(`${this.Freepbx}/pbxapis/NodeApis/blockForTFN`,data,this.httpOptions);
  }
  PostUnBlockCidTfn(data){
    return this.http.post(`${this.Freepbx}/pbxapis/NodeApis/UnblockForTFN`,data,this.httpOptions);
  }
  getDuplicateCall(data,first,last){
    return this.http.get(`${this.apiURL}/getDupesCalls/`+first+`/`+ last+data,this.httpOptions);
  }
}
