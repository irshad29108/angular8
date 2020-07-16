import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  Error500:false;
  NotWorkingInternet=false;
  constructor(private toastr: ToastrService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
        let errorMessage = '';

        if (err.error instanceof ErrorEvent) {
          console.log('clentsite Error');
          errorMessage = `Error: ${err.error.message}`;
          this.toastr.error('Error', errorMessage);
        }else{
          if(err.status!=undefined){
          errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            location.reload();
            this.toastr.error('Error', errorMessage);
          }
          
        }

        }

        return throwError(errorMessage);



        /*if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            location.reload();
        }else if(err.status===500){
          this.toastr.error('Server', 'Internal Server Error')
        }else{
          //if(this.NotWorkingInternet==false){
            if(err.status!=undefined){
              console.log('-------isahd------');
              this.NotWorkingInternet=true;
              this.toastr.error('Internet', 'Internet Is Not Working')
            }else{
              this.NotWorkingInternet=false;
            }
          //}
        }
       
        
       
          if (err.error instanceof ErrorEvent) {
            // client-side error
            console.log('client-side error')
            console.log(err.error.message);
            errorMessage = `Error: ${err.error.message}`;
          } else {
            // server-side error
            console.log('erver-side error')
            console.log(err);
            console.log('--1--');
            console.log(err.status);
            console.log('--2--');
            console.log(err.message);
            console.log('--3--');
            console.log(err.name);
            errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
          }
          //window.alert(errorMessage);
          

        
        //const errerror = err.error.message || err.statusText;
        
        //return throwError(error);

        */

    }))
}
}
