import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiBaseUrl;
  freePbx:string=environment.apiDirectUrl;
   httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
  }
  httpOptions2 = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/x-www-form-urlencoded',
     //'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
  }
  getallcampaign():Observable<any>{
    return this.http.get(`${this.apiURL}/Campaign/getAllCamp`,this.httpOptions)
  }
  postaddcampaign(data):Observable<any>{
    return this.http.post(`${this.apiURL}/Campaign/add`,data,this.httpOptions);
  }
  
  deleteCampaign(id):Observable<any>{
    return this.http.delete(`${this.apiURL}/Campaign/delete/`+id,this.httpOptions);
  }
  getTfnByID(id):Observable<any>{
    return this.http.get(`${this.apiURL}/getTfnByPublisher/`+id,this.httpOptions);
  }
  getCampaignById(id):Observable<any>{
    return this.http.get(`${this.apiURL}/Campaign/getCampaignByCampaignId/`+id,this.httpOptions)
  }
  postAddFreepbxCampaign(data):Observable<any>{
    return this.http.post(`${this.freePbx}/pbxapis/NodeApis/addCampaign`,data,this.httpOptions)
  }
  postAddFreepbxPauseCampaign(data):Observable<any>{
    return this.http.post(`${this.freePbx}/pbxapis/NodeApis/pauseCampaign`,data,this.httpOptions2)
  }
  postAddFreepbxPlayCampaign(data):Observable<any>{
    return this.http.post(`${this.freePbx}/pbxapis/NodeApis/playCampaign`,data,this.httpOptions2)
  }
  postFreepbxCommon(data):Observable<any>{
 
    return this.http.post(`${this.freePbx}/pbxapis/NodeApis/commonAPI`,data,this.httpOptions)
  }
  postUpdateCampaign(id,data):Observable<any>{
   return this.http.post(`${this.apiURL}/Campaign/edit/`+id,data,this.httpOptions)
  }
  getTfnFreepbxUpdate(tfn,queue):Observable<any>{
    return this.http.get(`${this.freePbx}/pbxapis/NodeApis/updateTFN?tfn=`+tfn+`&queue=`+queue,this.httpOptions)
  }
  postFreepbxCommonUpdate(data):Observable<any>{
    return this.http.post(`${this.freePbx}/pbxapis/NodeApis/commonUpdateAPI`,data,this.httpOptions)
  }
  getTfnByCampaignId(id):Observable<any>{
    return this.http.get(`${this.apiURL}/Campaign/getCampPubTfns/`+id,this.httpOptions)
  }
  getBuyerByCampaignId(id):Observable<any>{
    return this.http.get(`${this.apiURL}/Campaign/getCampBuyerTfns/`+id,this.httpOptions)
  }
  postFreePbxdelete(queue_no):Observable<any>{
    return this.http.post(`${this.freePbx}/pbxapis/NodeApis/deleteCampaign`,queue_no,this.httpOptions)
  }
  postDeletefreepbxcommon(number):Observable<any>{
    return this.http.post(`${this.freePbx}/pbxapis/NodeApis/commonDeleteAPI`,number,this.httpOptions)
  }
  getFreePbxAddBuyer(data):Observable<any>{
    return this.http.post(`${this.freePbx}/pbxapis/NodeApis/addBuyer`,data)
  }
  getEditFreePbxAddBuyer(data):Observable<any>{
    return this.http.post(`${this.freePbx}/pbxapis/NodeApis/editBuyer`,data)
  }
  
  deleteFreePbxBuyer(data):Observable<any>{
    return this.http.post(`${this.freePbx}/pbxapis/NodeApis/deleteBuyer`,data,this.httpOptions)
  }
  getQueueRelod():Observable<any>{
    return this.http.get(`${this.freePbx}/pbxapis/NodeApis/queue_reload`,this.httpOptions)
  }


}
