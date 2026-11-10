import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {
 constructor(private auth:AuthService,private router:Router){}
 canActivate():Observable<boolean|UrlTree>{return this.auth.ensure().pipe(map(user=>user?true:this.router.createUrlTree(['/ingresar'])));}
}
@Injectable({providedIn:'root'})
export class AdminGuard implements CanActivate {
 constructor(private auth:AuthService,private router:Router){}
 canActivate():Observable<boolean|UrlTree>{return this.auth.ensure().pipe(map(user=>user?.role==='admin'?true:this.router.createUrlTree(['/'])));}
}
