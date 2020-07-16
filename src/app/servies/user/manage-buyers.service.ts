import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageBuyersService {

  constructor(private router:Router,private http: HttpClient) { }
  apiURL: string = environment.apiBaseUrl;
   httpOptions = {
    headers: new HttpHeaders({ 
     'Content-Type':'application/json',
     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    })
  }
  postBuyersPublisher(Buyers):Observable<any>{
    return this.http.post(`${this.apiURL}/buyer`,Buyers,this.httpOptions);
  }
  getAllBuyers():Observable<any>{
    return this.http.get(`${this.apiURL}/buyer/getBuyer`,this.httpOptions)
  }
  editBuyerid(id):Observable<any>{
    return this.http.get(`${this.apiURL}/buyer/getBuyer/`+id,this.httpOptions)
  }
  updateBuyer(buyer,id):Observable<any>{
    return this.http.post(`${this.apiURL}/buyer/editBuyer/`+id,buyer,this.httpOptions)
  }
  deleteBuyer(id):Observable<any>{
    return this.http.delete(`${this.apiURL}/buyer/deleteBuyer/`+id,this.httpOptions);
  }
  getBuyerNumberByid():Observable<any>{
    return this.http.get(`${this.apiURL}/BuyerNumbers/getAllBuyerNumbers`,this.httpOptions)
  }
  postBuyernumber(data):Observable<any>{
    return this.http.post(`${this.apiURL}/BuyerNumbers/add`,data,this.httpOptions)
  }
  postEditCapping(data):Observable<any>{
    return this.http.post(`${this.apiURL}/cappings/editCappings`,data,this.httpOptions)
  }
  deleteBuyernumber(id):Observable<any>{
    return this.http.delete(`${this.apiURL}/BuyerNumbers/delete/`+id,this.httpOptions);
  }
  getNumberByid(id):Observable<any>{
    return this.http.get(`${this.apiURL}/BuyerNumbers/getBuyerNumber/`+id,this.httpOptions)
  }
  getBuyerByPubId(id):Observable<any>{
    return this.http.get(`${this.apiURL}/buyer/getBuyerByPubId/`+id,this.httpOptions)
  }
  postBuyerStatus(id,status):Observable<any>{
    return this.http.post(`${this.apiURL}/buyer/status/`+id,status,this.httpOptions);
  }

  getBuyerDetails():Observable<any>{
    return this.http.get(`${this.apiURL}/BuyerNumbers/getBuyerDetails/`,this.httpOptions);
  }

}
 