import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, map, tap, catchError } from 'rxjs';
import { environment } from '../environments/environment';
import { ResponseData, Session, User } from './models';
const KEY='pa3_tareas_token';
@Injectable({providedIn:'root'})
export class AuthService {
 readonly user$=new BehaviorSubject<User|null>(null);
 constructor(private http:HttpClient,private router:Router){
  window.addEventListener('pa3:unauthorized',()=>{this.clear();this.router.navigate(['/ingresar']);});
 }
 get token(){return sessionStorage.getItem(KEY);}
 get user(){return this.user$.value;}
 private save(session:Session){sessionStorage.setItem(KEY,session.token);this.user$.next(session.user);}
 login(email:string,password:string):Observable<Session>{
  return this.http.post<ResponseData<Session>>(`${environment.apiUrl}/auth/login`,{email,password}).pipe(map(r=>r.data),tap(v=>this.save(v)));
 }
 register(name:string,email:string,password:string):Observable<Session>{
  return this.http.post<ResponseData<Session>>(`${environment.apiUrl}/auth/register`,{name,email,password}).pipe(map(r=>r.data),tap(v=>this.save(v)));
 }
 ensure():Observable<User|null>{
  if(!this.token) return of(null);
  if(this.user) return of(this.user);
  return this.http.get<ResponseData<User>>(`${environment.apiUrl}/auth/me`).pipe(map(r=>r.data),tap(u=>this.user$.next(u)),catchError(()=>{this.clear();return of(null);}));
 }
 clear(){sessionStorage.removeItem(KEY);this.user$.next(null);}
 logout(){
  if(!this.token){this.clear();this.router.navigate(['/ingresar']);return;}
  this.http.post(`${environment.apiUrl}/auth/logout`,{}).subscribe({
   next:()=>{this.clear();this.router.navigate(['/ingresar']);},
   error:()=>{this.clear();this.router.navigate(['/ingresar']);}
  });
 }
}
