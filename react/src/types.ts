export type Role='user'|'admin';
export type TaskStatus='pendiente'|'en_progreso'|'completada';
export interface User{id:string;name:string;email:string;role:Role}
export interface Task{id:string;title:string;description:string;status:TaskStatus;dueDate:string|null;owner:string;createdAt:string;updatedAt:string}
export type TaskInput=Pick<Task,'title'|'description'|'status'|'dueDate'>;
export interface Summary{pendiente:number;en_progreso:number;completada:number}
export interface Session{token:string;user:User}
export interface ApiResult<T>{data:T;message?:string}
