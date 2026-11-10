import type { Request } from 'express';
export enum Role { USER='user', ADMIN='admin' }
export enum TaskStatus { PENDING='pendiente', PROGRESS='en_progreso', DONE='completada' }
export interface SessionUser { id: string; name: string; email: string; role: Role; tokenVersion: number }
export interface AuthenticatedRequest extends Request { user?: SessionUser }
export interface ApiResponse<T> { data: T; message?: string }
export interface TaskDTO { id: string; title: string; description: string; status: TaskStatus; dueDate: string | null; owner: string; createdAt: string; updatedAt: string }
export class HttpError extends Error {
  constructor(public statusCode: number, message: string) { super(message); this.name = 'HttpError'; }
}
