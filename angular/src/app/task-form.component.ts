import { Component,OnInit } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ApiService } from './api.service';
import { TaskInput, TaskStatus } from './models';
@Component({selector:'app-task-form',template:`
 <div class="page-head"><div><span class="eyebrow">FORMULARIO REACTIVO</span><h1>{{id?'Editar tarea':'Nueva tarea'}}</h1><p class="muted">Los cambios se guardarán en MongoDB.</p></div><a routerLink="/tareas" class="btn btn-outline">Volver</a></div>
 <div class="panel form-panel"><form [formGroup]="form" (ngSubmit)="save()" novalidate>
  <label>Título *<input formControlName="title" placeholder="Ej. Preparar presentación" maxlength="120"/><small *ngIf="form.controls.title.touched && form.controls.title.invalid" class="invalid">Entre 3 y 120 caracteres.</small></label>
  <label>Descripción<textarea rows="4" formControlName="description" maxlength="1000" placeholder="Detalles de la tarea"></textarea></label>
  <div class="form-row"><label>Estado<select formControlName="status"><option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option></select></label>
  <label>Fecha límite<input type="date" formControlName="dueDate"/></label></div>
  <p *ngIf="error" class="alert error" role="alert">{{error}}</p>
  <div class="actions"><button type="submit" class="btn btn-primary" [disabled]="busy">{{busy?'Guardando...':'Guardar tarea'}}</button><a routerLink="/tareas" class="btn btn-ghost">Cancelar</a></div>
 </form></div>`})
export class TaskFormComponent implements OnInit {
 id:string|null=null;busy=false;error='';
 form=this.fb.nonNullable.group({title:['',[Validators.required,Validators.minLength(3),Validators.maxLength(120)]],description:['',[Validators.maxLength(1000)]],status:[TaskStatus.PENDING,[Validators.required]],dueDate:['']});
 constructor(private fb:FormBuilder,private api:ApiService,private route:ActivatedRoute,private router:Router){}
 ngOnInit(){this.id=this.route.snapshot.paramMap.get('id');if(this.id)this.api.getTask(this.id).subscribe({next:t=>this.form.patchValue({title:t.title,description:t.description,status:t.status,dueDate:t.dueDate||''}),error:e=>this.error=e.error?.message||'No se encontró la tarea'});}
 save(){if(this.form.invalid){this.form.markAllAsTouched();this.error='Revisa los campos obligatorios';return;}
  const v=this.form.getRawValue();const input:TaskInput={title:v.title.trim(),description:v.description.trim(),status:v.status,dueDate:v.dueDate||null};
  this.busy=true;this.error='';const call=this.id?this.api.updateTask(this.id,input):this.api.createTask(input);
  call.subscribe({next:()=>this.router.navigate(['/tareas'],{queryParams:{guardado:this.id?'editada':'creada'}}),error:e=>{this.busy=false;this.error=e.error?.message||'No se pudo guardar';}});
 }
}
