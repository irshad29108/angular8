import { Injectable } from '@angular/core';
import { CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';
import { LoginService } from '../servies/user/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements  CanActivate {
  constructor(private router:Router,public authservice:LoginService){}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean { 

    if(localStorage.getItem('token')==null){
      this.router.navigate(['login']);
      return false
    }else{
      return true
    }

}
}
