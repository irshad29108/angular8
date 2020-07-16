import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class IvrService{
    constructor(private router:Router,private http:HttpClient){}
    apiURL: string = environment.apiBaseUrl;
    freePbx:string=environment.apiDirectUrl;
    httpBaseHeader={
        headers: new HttpHeaders({ 
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
           })
    };

    httpClientHeader={
        headers:new HttpHeaders({
            'Content-Type':'application/x-www-form-urlencoded',
        })
    }


    getAllmusics():Observable<any>{
        return this.http.get(`${this.freePbx}/pbxapis/NodeApis/getallmusic`,this.httpClientHeader);
    }
    addIvrMusic(data):Observable<any>{
        return this.http.post(`${this.freePbx}/pbxapis/NodeApis/addmusic`,data,this.httpClientHeader);

    }

    editIvrMusic(data):Observable<any>{
        return this.http.post(`${this.freePbx}/pbxapis/NodeApis/editmusic`,data,this.httpClientHeader);

    }
    addIvrMusicDirect(data):Observable<any>{
        return this.http.post(`${this.freePbx}/pbxapis/NodeApis/uploadmoh`,data,this.httpClientHeader);

    }
    deleteIvrMusic(id):Observable<any>{
        let data={'id':id}
        return this.http.post(`${this.freePbx}/pbxapis/NodeApis/deletemusic`,data, this.httpClientHeader)
    }

    addIvrMusicBase(data):Observable<any>{
        return this.http.post(`${this.freePbx}/pbxapis/NodeApis/uploadmoh`,data,this.httpClientHeader);

    }
    // ==================================================================================
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~IVR Service~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ==================================================================================
    addIvr(data):Observable<any>{
        return this.http.post(`${this.freePbx}/pbxapis/NodeApis/add_ivr_details`,data,this.httpClientHeader);
    }
    getAllIvr():Observable<any>{
        return this.http.get(`${this.freePbx}/pbxapis/NodeApis/get_ivr_details`,this.httpClientHeader);
    }
    deleteIvr(id):Observable<any>{
        let data={'id':id}
        return this.http.post(`${this.freePbx}/pbxapis/NodeApis/delete_ivr_details`,data, this.httpClientHeader)
    }

    editIvr(data):Observable<any>{
        return this.http.post(`${this.freePbx}/pbxapis/NodeApis/edit_ivr_details`,data,this.httpClientHeader);

    }

    addIvrEntries(data):Observable<any>{
        return this.http.post(`${this.freePbx}/pbxapis/NodeApis/add_ivr_entries`,data,this.httpClientHeader);
    }

    getIvrEntries():Observable<any>{
        return this.http.get(`${this.freePbx}/pbxapis/NodeApis/get_ivr_entries`,this.httpClientHeader);
    }

    deleteIvrEntries(id):Observable<any>{
        let data={'ivr_id':id}
        return this.http.post(`${this.freePbx}/pbxapis/NodeApis/delete_ivr_entries`,data, this.httpClientHeader)
    }

    getQueueRelod():Observable<any>{
        return this.http.get(`${this.freePbx}/pbxapis/NodeApis/queue_reload`,this.httpBaseHeader)
    }


}