import { Router } from 'express';
import { Task } from '../models/Task';
import { AuthenticatedRequest, HttpError, Role } from '../types';
import { asyncHandler, assertObjectId, serializeTask, summarizeTasks } from '../helpers';
import { requireAuth } from '../middlewares';
import { taskPatchSchema, taskSchema } from '../validation';
const router=Router(); router.use(requireAuth);
function scope(req: AuthenticatedRequest){ return req.user!.role === Role.ADMIN ? {} : {owner:req.user!.id}; }
router.get('/',asyncHandler(async (req,res) => {
  const tasks=await Task.find(scope(req as AuthenticatedRequest)).sort({createdAt:-1}).limit(200).lean();
  res.json({data:tasks.map(serializeTask),total:tasks.length});
}));
router.get('/summary',asyncHandler(async (req,res) => {
  const tasks=await Task.find(scope(req as AuthenticatedRequest),'status').lean();
  res.json({data:summarizeTasks(tasks)});
}));
router.get('/:id',asyncHandler(async (req,res) => {
  assertObjectId(req.params.id);
  const task=await Task.findOne({_id:req.params.id,...scope(req as AuthenticatedRequest)});
  if (!task) throw new HttpError(404,'Tarea no encontrada');
  res.json({data:serializeTask(task)});
}));
router.post('/',asyncHandler(async (req,res) => {
  const data=taskSchema.parse(req.body);
  const task=await Task.create({...data,owner:(req as AuthenticatedRequest).user!.id});
  res.status(201).json({data:serializeTask(task),message:'Tarea creada'});
}));
router.put('/:id',asyncHandler(async (req,res) => {
  assertObjectId(req.params.id);
  const data=taskSchema.parse(req.body);
  const task=await Task.findOneAndUpdate({_id:req.params.id,...scope(req as AuthenticatedRequest)},{$set:data},{new:true,runValidators:true});
  if (!task) throw new HttpError(404,'Tarea no encontrada');
  res.json({data:serializeTask(task),message:'Tarea actualizada'});
}));
router.patch('/:id',asyncHandler(async (req,res) => {
  assertObjectId(req.params.id);
  const data=taskPatchSchema.parse(req.body);
  const task=await Task.findOneAndUpdate({_id:req.params.id,...scope(req as AuthenticatedRequest)},{$set:data},{new:true,runValidators:true});
  if (!task) throw new HttpError(404,'Tarea no encontrada');
  res.json({data:serializeTask(task),message:'Tarea actualizada'});
}));
router.delete('/:id',asyncHandler(async (req,res) => {
  assertObjectId(req.params.id);
  const task=await Task.findOneAndDelete({_id:req.params.id,...scope(req as AuthenticatedRequest)});
  if (!task) throw new HttpError(404,'Tarea no encontrada');
  res.json({message:'Tarea eliminada'});
}));
export default router;
