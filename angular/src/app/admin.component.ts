import { Component,OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { User } from './models';
@Component({selector:'app-admin',template:`
 <div class="page-head"><div><span class="eyebrow">ACCESO POR ROL</span><h1>Administración</h1><p class="muted">Solo los administradores pueden consultar esta página y el endpoint.</p></div></div>
 <p class="alert error" *ngIf="error">{{error}}</p>
 <section class="panel table-panel"><h2>Usuarios registrados</h2><div class="table-scroll"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead><tbody><tr *ngFor="let u of users"><td>{{u.name}}</td><td>{{u.email}}</td><td><span class="status">{{u.role}}</span></td></tr></tbody></table></div></section>`})
export class AdminComponent implements OnInit{users:User[]=[];error='';constructor(private api:ApiService){}ngOnInit(){this.api.getUsers().subscribe({next:u=>this.users=u,error:e=>this.error=e.error?.message||'No se pudo cargar'});}}
