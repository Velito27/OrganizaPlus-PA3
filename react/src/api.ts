import type { ApiResult, Session, Summary, Task, TaskInput, User } from './types';
const ROOT=import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const KEY='pa3_react_token';
export const tokenStore={get:()=>sessionStorage.getItem(KEY),set:(token:string)=>sessionStorage.setItem(KEY,token),clear:()=>sessionStorage.removeItem(KEY)};
export class ApiError extends Error{constructor(public status:number,message:string){super(message);this.name='ApiError';}}
export async function request<T>(path:string,options:RequestInit={}):Promise<T>{
 const headers=new Headers(options.headers);headers.set('Accept','application/json');
 if(options.body) headers.set('Content-Type','application/json');
 const token=tokenStore.get();if(token)headers.set('Authorization',`Bearer ${token}`);
 let res:Response;
 try{res=await fetch(`${ROOT}${path}`,{...options,headers});}
 catch {throw new ApiError(0,'No se pudo conectar con el servidor');}
 const body:unknown=await res.json().catch(()=>({}));
 if(!res.ok){
   if(res.status===401 && !path.endsWith('/login') && !path.endsWith('/register')){tokenStore.clear();window.dispatchEvent(new Event('pa3:unauthorized'));}
   const detail=body as {message?:string};throw new ApiError(res.status,detail.message||`Error HTTP ${res.status}`);
 }
 return body as T;
}
export const api={
 login:(email:string,password:string)=>request<ApiResult<Session>>('/auth/login',{method:'POST',body:JSON.stringify({email,password})}),
 register:(name:string,email:string,password:string)=>request<ApiResult<Session>>('/auth/register',{method:'POST',body:JSON.stringify({name,email,password})}),
 me:()=>request<ApiResult<User>>('/auth/me'),
 logout:()=>request<{message:string}>('/auth/logout',{method:'POST'}),
 tasks:()=>request<ApiResult<Task[]>>('/tasks'),
 task:(id:string)=>request<ApiResult<Task>>(`/tasks/${id}`),
 create:(value:TaskInput)=>request<ApiResult<Task>>('/tasks',{method:'POST',body:JSON.stringify(value)}),
 update:(id:string,value:TaskInput)=>request<ApiResult<Task>>(`/tasks/${id}`,{method:'PUT',body:JSON.stringify(value)}),
 remove:(id:string)=>request<{message:string}>(`/tasks/${id}`,{method:'DELETE'}),
 summary:()=>request<ApiResult<Summary>>('/tasks/summary'),
 users:()=>request<ApiResult<User[]>>('/admin/users')
};
