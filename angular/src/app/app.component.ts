import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';
@Component({selector:'app-root',template:`
<div class="shell">
 <aside class="sidebar">
  <a class="logo" routerLink="/"><span class="logo-icon">✓</span><span>Organiza<span class="accent">+</span><small>PA3 · Angular 16</small></span></a>
  <nav class="nav">
   <a routerLink="/" [routerLinkActiveOptions]="{exact:true}" routerLinkActive="active">⌂ &nbsp; Resumen</a>
   <a routerLink="/tareas" routerLinkActive="active">▤ &nbsp; Mis tareas</a>
   <a routerLink="/tareas/nueva" routerLinkActive="active">＋ &nbsp; Nueva tarea</a>
   <a routerLink="/admin" *ngIf="auth.user?.role==='admin'" routerLinkActive="active">♙ &nbsp; Administración</a>
   <a [href]="reactUrl" target="_blank" rel="noopener">↗ &nbsp; Panel React</a>
  </nav>
  <div class="sidebar-bottom"><small>Una API. Dos interfaces.</small></div>
 </aside>
 <div class="workspace">
  <header class="topbar"><div class="topbar-heading">Sistema de gestión de tareas <span class="tag">Angular</span></div>
   <div class="user-menu"><span *ngIf="auth.user">{{auth.user?.name}}</span>
    <button *ngIf="auth.user" class="btn btn-ghost small" (click)="auth.logout()">Salir</button>
    <a *ngIf="!auth.user" routerLink="/ingresar" class="btn btn-ghost small">Ingresar</a></div>
  </header>
  <main class="main"><router-outlet></router-outlet></main>
 </div>
</div>`})
export class AppComponent{reactUrl=environment.reactUrl;constructor(public auth:AuthService){}}
