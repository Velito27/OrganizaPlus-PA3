export type Role = 'user'|'admin';
export enum TaskStatus { PENDING='pendiente', PROGRESS='en_progreso', DONE='completada' }
export interface User { id:string; name:string; email:string; role:Role }
export interface Task { id:string; title:string; description:string; status:TaskStatus; dueDate:string|null; owner:string; createdAt:string; updatedAt:string }
export interface TaskInput { title:string; description:string; status:TaskStatus; dueDate:string|null }
export interface ResponseData<T> { data:T; message?:string }
export interface Session { token:string; user:User }
export interface Summary { pendiente:number; en_progreso:number; completada:number }
