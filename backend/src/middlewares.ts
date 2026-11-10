import type { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { User } from './models/User';
import { config } from './config';
import { asyncHandler } from './helpers';
import { AuthenticatedRequest, HttpError, Role } from './types';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

export const requireAuth: RequestHandler = asyncHandler(async (req, _res, next) => {
  const raw = req.headers.authorization;
  if (!raw || !/^Bearer \S+$/.test(raw)) throw new HttpError(401,'Debe iniciar sesión');
  let payload: JwtPayload;
  try {
    const decoded = jwt.verify(raw.slice(7), config.JWT_SECRET, {algorithms:['HS256'],issuer:'pa3-tareas',audience:'pa3-clientes'});
    if (typeof decoded === 'string' || !decoded.sub || typeof decoded.version !== 'number') throw new Error('jwt incorrecto');
    payload = decoded;
  } catch { throw new HttpError(401,'Sesión vencida o inválida'); }
  const user = await User.findById(payload.sub);
  if (!user || user.tokenVersion !== payload.version) throw new HttpError(401,'Sesión revocada');
  (req as AuthenticatedRequest).user = {id:String(user._id),name:user.name,email:user.email,role:user.role as Role,tokenVersion:user.tokenVersion};
  next();
});
export const requireRole = (role: Role): RequestHandler => (req,res,next) => {
  if ((req as AuthenticatedRequest).user?.role !== role) return next(new HttpError(403,'Acceso solo para administradores'));
  next();
};
export function notFound(_req:Request,_res:Response,next:NextFunction){next(new HttpError(404,'Ruta no encontrada'));}
export function errorHandler(err:unknown, _req:Request, res:Response, _next:NextFunction) {
  if (err instanceof ZodError) {res.status(400).json({message:'Datos inválidos',errors:err.flatten().fieldErrors});return;}
  if (err instanceof HttpError) {res.status(err.statusCode).json({message:err.message});return;}
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {res.status(400).json({message:'Datos inválidos'});return;}
  if (typeof err === 'object' && err && 'code' in err && err.code === 11000) {res.status(409).json({message:'El correo ya está registrado'});return;}
  console.error(err);
  res.status(500).json({message:'Error interno del servidor'});
}
