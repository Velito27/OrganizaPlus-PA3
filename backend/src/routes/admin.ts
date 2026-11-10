import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares';
import { asyncHandler, publicUser } from '../helpers';
import { User } from '../models/User';
import { Task } from '../models/Task';
import { Role } from '../types';
const router=Router(); router.use(requireAuth,requireRole(Role.ADMIN));
router.get('/users',asyncHandler(async (_req,res) => {
  const users=await User.find().sort({createdAt:-1}).limit(200);
  res.json({data:users.map(publicUser)});
}));
router.get('/metrics',asyncHandler(async (_req,res) => {
  const [users,tasks] = await Promise.all([User.countDocuments(),Task.countDocuments()]);
  res.json({data:{users,tasks}});
}));
export default router;
