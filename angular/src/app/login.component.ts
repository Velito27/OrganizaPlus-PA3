import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
@Component({selector:'app-login',template:`
<section class="auth-wrap"><div class="panel auth-panel">
 <span class="eyebrow">ACCESO SEGURO</span><h1>{{registerMode?'Crear cuenta':'Bienvenido de nuevo'}}</h1>
 <p class="muted">{{registerMode?'Registra tu usuario para organizar tareas.':'Ingresa con tu correo y contraseña.'}}</p>
 <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
  <label *ngIf="registerMode">Nombre<input formControlName="name" autocomplete="name" placeholder="Tu nombre"/></label>
  <label>Correo electrónico<input type="email" formControlName="email" autocomplete="email" placeholder="nombre@correo.com"/></label>
  <label>Contraseña<input type="password" formControlName="password" [attr.autocomplete]="registerMode?'new-password':'current-password'" placeholder="Mínimo 8 caracteres"/></label>
  <p class="alert error" *ngIf="error" role="alert">{{error}}</p>
  <button class="btn btn-primary full" type="submit" [disabled]="busy">{{busy?'Procesando...':(registerMode?'Registrarme':'Iniciar sesión')}}</button>
 </form>
 <p class="muted text-center"><button class="link-button" (click)="switchMode()">{{registerMode?'Ya tengo cuenta':'Crear una cuenta'}}</button></p>
</div></section>`})
export class LoginComponent {
 registerMode=location.pathname==='/registro';busy=false;error='';
 form=this.fb.group({name:[''],email:['',[Validators.required,Validators.email]],password:['',[Validators.required,Validators.minLength(8)]]});
 constructor(private fb:FormBuilder,private auth:AuthService,private router:Router){}
 switchMode(){this.registerMode=!this.registerMode;this.error='';this.form.reset();this.router.navigate([this.registerMode?'/registro':'/ingresar']);}
 submit(){
  if(this.registerMode && (!this.form.value.name || this.form.value.name.trim().length<2)){this.error='Ingresa un nombre de al menos 2 caracteres';return;}
  if(this.form.invalid){this.error='Revisa el correo y la contraseña (mínimo 8 caracteres)';return;}
  this.busy=true;this.error='';const {name,email,password}=this.form.getRawValue();
  const request=this.registerMode?this.auth.register(name||'',email||'',password||''):this.auth.login(email||'',password||'');
  request.subscribe({next:()=>{this.busy=false;this.router.navigate(['/']);},error:(e:HttpErrorResponse)=>{this.busy=false;this.error=e.error?.message||'No se pudo completar la solicitud';}});
 }
}
