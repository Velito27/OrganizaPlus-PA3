import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { DashboardComponent } from './dashboard.component';
import { TasksComponent } from './tasks.component';
import { TaskFormComponent } from './task-form.component';
import { AdminComponent } from './admin.component';
import { AuthGuard, AdminGuard } from './guards';
import { AuthInterceptor } from './auth.interceptor';
const routes:Routes=[
 {path:'',component:DashboardComponent,canActivate:[AuthGuard]},
 {path:'tareas',component:TasksComponent,canActivate:[AuthGuard]},
 {path:'tareas/nueva',component:TaskFormComponent,canActivate:[AuthGuard]},
 {path:'tareas/:id/editar',component:TaskFormComponent,canActivate:[AuthGuard]},
 {path:'admin',component:AdminComponent,canActivate:[AdminGuard]},
 {path:'ingresar',component:LoginComponent}, {path:'registro',component:LoginComponent},
 {path:'**',redirectTo:''}
];
@NgModule({declarations:[AppComponent,LoginComponent,DashboardComponent,TasksComponent,TaskFormComponent,AdminComponent],
 imports:[BrowserModule,HttpClientModule,ReactiveFormsModule,RouterModule.forRoot(routes)],
 providers:[{provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true}],bootstrap:[AppComponent]})
export class AppModule{}
