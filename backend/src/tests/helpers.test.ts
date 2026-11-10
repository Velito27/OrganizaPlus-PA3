import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeTasks } from '../helpers';
import { TaskStatus } from '../types';
test('resumen de tareas es inmutable y suma por estado',()=>{
 const tasks=[{status:TaskStatus.DONE},{status:TaskStatus.PENDING},{status:TaskStatus.DONE}] as const;
 assert.deepEqual(summarizeTasks(tasks),{pendiente:1,en_progreso:0,completada:2});
 assert.equal(tasks.length,3);
});
