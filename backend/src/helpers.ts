import type { RequestHandler } from 'express';
import type { TaskDTO } from './types';
import { TaskStatus } from './types';
import { HttpError } from './types';
import { Types } from 'mongoose';

export const asyncHandler = (handler: (...args: Parameters<RequestHandler>) => Promise<unknown>): RequestHandler =>
  (req, res, next) => { Promise.resolve(handler(req,res,next)).catch(next); };
export function assertObjectId(value: string): void {
  if (!Types.ObjectId.isValid(value) || !/^[0-9a-fA-F]{24}$/.test(value)) throw new HttpError(400,'Identificador inválido');
}
export const publicUser = (user: { _id: unknown; name: string; email: string; role: string }) =>
  ({id:String(user._id), name:user.name, email:user.email, role:user.role});
export function serializeTask(t: { _id:unknown; title:string; description:string; status: string; dueDate?:Date|null; owner:unknown; createdAt:Date; updatedAt:Date }):TaskDTO {
  return {id:String(t._id), title:t.title,description:t.description,status:t.status as TaskStatus,
    dueDate:t.dueDate ? t.dueDate.toISOString().slice(0,10) : null,
    owner:String(t.owner),createdAt:t.createdAt.toISOString(),updatedAt:t.updatedAt.toISOString()};
}
export function summarizeTasks(tasks: ReadonlyArray<{status:string}>) {
  return tasks.reduce((totals,task) => {
    if (task.status === TaskStatus.PENDING || task.status === TaskStatus.PROGRESS || task.status === TaskStatus.DONE) {
      return {...totals,[task.status]:totals[task.status]+1};
    }
    return totals;
  }, {pendiente:0,en_progreso:0,completada:0});
}
