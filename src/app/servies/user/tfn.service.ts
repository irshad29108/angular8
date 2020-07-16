import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TfnService {

  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiBaseUrl;
  apiFreepbx:string=environment.apiDirectUrl;
   httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
    
  };
  httpOptions2 = {
    headers: new HttpHeaders({ 
      'Content-Type':'application/x-www-form-urlencoded',
    })
    
    
      
  };
  getTFN(tfn):Observable<any>{
    return this.http.post(`${this.apiURL}/addTfn`,tfn,this.httpOptions);
  }
  getAllTFN():Observable<any>{
    return this.http.get(`${this.apiURL}/getAllTfns`,this.httpOptions).pipe(
      catchError(this.handleError)
      );
  }
  getTFNbyid(uid):Observable<any>{
    return this.http.get(`${this.apiURL}/getTfnByPublisher/`+uid,this.httpOptions);
  }
  deleteTFN(id):Observable<any>{
    return this.http.delete(`${this.apiURL}/tfn/delete/`+id,this.httpOptions);
  }
  deleteTfnMultiple(tfn):Observable<any>{
    let alltfn={tfn:tfn}
    return this.http.post(`${this.apiURL}/deleteTfns`,alltfn,this.httpOptions);
  }
  getTFNbyObjectId(id):Observable<any>{
    return this.http.get(`${this.apiURL}/getTfnById/`+id,this.httpOptions);
  }
  getTfnFreepbxAdd(tfn):Observable<any>{
    return this.http.get(`${this.apiFreepbx}/pbxapis/NodeApis/addTFN?tfns=`+tfn,this.httpOptions)
  }
  deleteTfnFreepbx(tfn):Observable<any>{
    return this.http.delete(`${this.apiFreepbx}/pbxapis/NodeApis/deleteTFN?tfns=`+tfn,this.httpOptions)
  }
  deleteTfnMultipuleFreepbx(tfn):Observable<any>{
    let alltfn={tfns:tfn}
    return this.http.post(`${this.apiFreepbx}/pbxapis/NodeApis/deleteTFNs`,alltfn,this.httpOptions2)
  }
  postTfnStatus(tfn):Observable<any>{
    return this.http.post(`${this.apiURL}/updateStatus`,tfn,this.httpOptions);
  }
  getUnsignTfn(tfn):Observable<any>{
    return this.http.get(`${this.apiFreepbx}/pbxapis/NodeApis/unassignTFN?tfn=`+tfn,this.httpOptions)
  }
  updateMoh(tfn,status):Observable<any>{
    return this.http.get(`${this.apiFreepbx}/pbxapis/NodeApis/updateMOH?tfn=`+tfn+`&moh=`+status,this.httpOptions)
  }
  allMoh():Observable<any>{
    return this.http.get(`${this.apiFreepbx}/pbxapis/NodeApis/moh`,this.httpOptions)
  }

  handleError(error: HttpErrorResponse){
  return throwError(error);
  }
}
