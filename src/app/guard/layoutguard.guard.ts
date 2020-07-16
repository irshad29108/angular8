import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LayoutguardGuard implements  CanActivate {
  constructor(private router:Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {   
    if(localStorage.getItem('token')!=null){
      this.router.navigate(['dashboard']);
      return false
    }else{
      return true
    }

}
}
