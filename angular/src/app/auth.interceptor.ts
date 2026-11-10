import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
 intercept(req:HttpRequest<unknown>,next:HttpHandler){
  const token=sessionStorage.getItem('pa3_tareas_token');
  const request=token?req.clone({setHeaders:{Authorization:`Bearer ${token}`}}):req;
  return next.handle(request).pipe(catchError((err:HttpErrorResponse)=>{
   if(err.status===401 && !/\/auth\/(login|register)$/.test(req.url)){
    window.dispatchEvent(new Event('pa3:unauthorized'));
   }
   return throwError(()=>err);
  }));
 }
}
