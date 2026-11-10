import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Task } from './models';
@Component({selector:'app-tasks',template:`
 <div class="page-head"><div><span class="eyebrow">REGISTROS PERSISTENTES</span><h1>{{auth.user?.role==='admin'?'Todas las tareas':'Mis tareas'}}</h1><p class="muted">Administra registros de la base de datos.</p></div><a routerLink="/tareas/nueva" class="btn btn-primary">+ Nueva tarea</a></div>
 <div *ngIf="message" class="alert success" role="status">{{message}}</div>
 <div *ngIf="error" class="alert error" role="alert">{{error}}</div>
 <section class="panel table-panel"><div class="table-top"><h2>Listado de tareas</h2><button class="btn btn-outline small" (click)="load()">Actualizar</button></div>
 <p class="muted" *ngIf="loading">Cargando desde MongoDB...</p>
 <p class="empty" *ngIf="!loading && tasks.length===0">Todavía no hay tareas. Crea la primera para comenzar.</p>
 <div class="table-scroll" *ngIf="!loading && tasks.length"><table><thead><tr><th>Tarea</th><th>Estado</th><th>Vencimiento</th><th>Acciones</th></tr></thead><tbody>
  <tr *ngFor="let task of tasks; trackBy:trackTask"><td><strong>{{task.title}}</strong><small>{{task.description||'Sin descripción'}}</small></td><td><span class="status" [ngClass]="task.status">{{stateLabel(task.status)}}</span></td><td>{{task.dueDate||'Sin fecha'}}</td><td><div class="actions"><a class="btn btn-ghost small" [routerLink]="['/tareas',task.id,'editar']">Editar</a><button class="btn btn-danger small" (click)="remove(task)">Eliminar</button></div></td></tr>
 </tbody></table></div></section>`})
export class TasksComponent implements OnInit {
 tasks:Task[]=[];message='';error='';loading=true;
 constructor(private api:ApiService,public auth:AuthService,private route:ActivatedRoute){}
 ngOnInit(){const result=this.route.snapshot.queryParamMap.get('guardado');if(result==='creada'||result==='editada')this.message=`Tarea ${result} correctamente`;this.load();}
 trackTask(_i:number,t:Task){return t.id;}
 stateLabel(s:string){return s==='en_progreso'?'En progreso':s==='completada'?'Completada':'Pendiente';}
 load(){this.loading=true;this.error='';this.api.getTasks().subscribe({next:v=>{this.tasks=v;this.loading=false;},error:e=>{this.loading=false;this.error=e.error?.message||'Error de conexión';}});}
 remove(task:Task){if(!confirm(`¿Eliminar la tarea "${task.title}"?`))return;
  this.api.deleteTask(task.id).subscribe({next:()=>{this.message='Tarea eliminada correctamente';this.load();},error:e=>this.error=e.error?.message||'No se pudo eliminar'});
 }
}
