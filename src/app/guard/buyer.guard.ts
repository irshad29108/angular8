import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BuyerGuard implements   CanActivate{
  constructor(private router:Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean { 
    let data = JSON.parse(localStorage.getItem('username'))
    if(!data){
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      this.router.navigate(['login']);
    }
    if(data.role=='buyer'){
     
      this.router.navigate(['']);
      return false
    }else{
      
      return true
    }
  }
  
}
