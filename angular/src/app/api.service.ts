import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import { ResponseData, Task, TaskInput, Summary, User } from './models';
@Injectable({providedIn:'root'})
export class ApiService {
 private readonly base=environment.apiUrl;
 constructor(private http:HttpClient){}
 getTasks():Observable<Task[]>{return this.http.get<ResponseData<Task[]>>(`${this.base}/tasks`).pipe(map(r=>r.data));}
 getTask(id:string){return this.http.get<ResponseData<Task>>(`${this.base}/tasks/${id}`).pipe(map(r=>r.data));}
 createTask(data:TaskInput){return this.http.post<ResponseData<Task>>(`${this.base}/tasks`,data).pipe(map(r=>r.data));}
 updateTask(id:string,data:TaskInput){return this.http.put<ResponseData<Task>>(`${this.base}/tasks/${id}`,data).pipe(map(r=>r.data));}
 deleteTask(id:string){return this.http.delete(`${this.base}/tasks/${id}`);}
 getSummary(){return this.http.get<ResponseData<Summary>>(`${this.base}/tasks/summary`).pipe(map(r=>r.data));}
 getUsers(){return this.http.get<ResponseData<User[]>>(`${this.base}/admin/users`).pipe(map(r=>r.data));}
}
