import { Component,OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Summary } from './models';
@Component({selector:'app-dashboard',template:`
 <div class="page-head"><div><span class="eyebrow">VISTA GENERAL</span><h1>Panel principal</h1><p class="muted">Seguimiento de las tareas guardadas en MongoDB.</p></div><a class="btn btn-primary" routerLink="/tareas/nueva">+ Agregar tarea</a></div>
 <p class="alert error" *ngIf="error">{{error}}</p>
 <div class="stats-grid" *ngIf="summary">
  <div class="stat"><div class="stat-label">Pendientes</div><div class="stat-number">{{summary.pendiente}}</div><small>Por comenzar</small></div>
  <div class="stat"><div class="stat-label">En progreso</div><div class="stat-number">{{summary.en_progreso}}</div><small>En desarrollo</small></div>
  <div class="stat"><div class="stat-label">Completadas</div><div class="stat-number">{{summary.completada}}</div><small>Terminadas</small></div>
 </div>
 <section class="panel information"><h2>Una sola base de datos</h2><p class="muted">Este panel Angular y el panel React utilizan la misma API REST. Crea una tarea aquí y aparecerá en React al actualizar.</p><a routerLink="/tareas" class="btn btn-outline">Ver todas las tareas</a></section>
`})
export class DashboardComponent implements OnInit {
 summary?:Summary;error='';constructor(private api:ApiService){}
 ngOnInit(){this.api.getSummary().subscribe({next:s=>this.summary=s,error:e=>this.error=e.error?.message||'No se pudieron obtener los datos'});}
}
