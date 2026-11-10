import { z } from 'zod';
import { TaskStatus } from './types';
export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254).transform(s => s.toLowerCase()),
  password: z.string().min(8).max(72)
}).strict();
export const loginSchema = z.object({
  email: z.string().trim().email().transform(s => s.toLowerCase()), password: z.string().min(1)
}).strict();
const optionalDueDate = z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s => (() => { const d = new Date(s+'T12:00:00Z'); const [y,m,day]=s.split('-').map(Number); return d.getUTCFullYear()===y && d.getUTCMonth()+1===m && d.getUTCDate()===day; })(), 'Fecha inválida'), z.null()]);
export const taskSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(1000).default(''),
  status: z.nativeEnum(TaskStatus),
  dueDate: optionalDueDate.default(null)
}).strict();
export const taskPatchSchema = taskSchema.partial().refine(v => Object.keys(v).length > 0, 'Debe enviar un campo');
