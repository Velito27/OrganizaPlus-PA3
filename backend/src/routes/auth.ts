import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { registerSchema, loginSchema } from '../validation';
import { asyncHandler, publicUser } from '../helpers';
import { requireAuth } from '../middlewares';
import { AuthenticatedRequest, HttpError, Role } from '../types';
const router = Router();
function token(user: {_id:unknown;tokenVersion:number}) {
  return jwt.sign({version:user.tokenVersion},config.JWT_SECRET,{
    algorithm:'HS256', subject:String(user._id), issuer:'pa3-tareas', audience:'pa3-clientes',
    expiresIn: config.JWT_EXPIRES_IN as SignOptions['expiresIn']
  });
}
router.post('/register',asyncHandler(async (req,res) => {
  const data=registerSchema.parse(req.body);
  if (await User.exists({email:data.email})) throw new HttpError(409,'El correo ya está registrado');
  const passwordHash=await bcrypt.hash(data.password,12);
  const user=await User.create({name:data.name,email:data.email,passwordHash,role:Role.USER});
  res.status(201).json({data:{user:publicUser(user),token:token(user)},message:'Usuario registrado'});
}));
router.post('/login',asyncHandler(async (req,res) => {
  const data=loginSchema.parse(req.body);
  const user=await User.findOne({email:data.email}).select('+passwordHash');
  if (!user || !(await bcrypt.compare(data.password,user.passwordHash))) throw new HttpError(401,'Credenciales incorrectas');
  res.json({data:{user:publicUser(user),token:token(user)},message:'Sesión iniciada'});
}));
router.get('/me',requireAuth,asyncHandler(async (req,res) => {
  const u=(req as AuthenticatedRequest).user!;
  res.json({data:{id:u.id,name:u.name,email:u.email,role:u.role}});
}));
router.post('/logout',requireAuth,asyncHandler(async (req,res) => {
  await User.findByIdAndUpdate((req as AuthenticatedRequest).user!.id,{$inc:{tokenVersion:1}});
  res.json({message:'Sesión cerrada en todos los dispositivos'});
}));
export default router;
