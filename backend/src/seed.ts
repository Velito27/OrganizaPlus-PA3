import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { config } from './config';
import { User } from './models/User';
import { Task } from './models/Task';
import { Role, TaskStatus } from './types';
async function seed(){
 const email=process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
 const password=process.env.SEED_ADMIN_PASSWORD;
 if(!email || !password || password.length<12 || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) throw new Error('Defina SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD (12+ caracteres) en el entorno local');
 await mongoose.connect(config.MONGODB_URI);
 let admin=await User.findOne({email});
 if(!admin){admin=await User.create({name:'Administrador',email,passwordHash:await bcrypt.hash(password,12),role:Role.ADMIN});}
 else if(admin.role !== Role.ADMIN) throw new Error('Ya existe el correo con un rol distinto; no se puede promover automáticamente');
 if(await Task.countDocuments({owner:admin._id})===0){
   await Task.create([
    {title:'Preparar informe del curso',description:'Ordenar las secciones del informe',status:TaskStatus.DONE,owner:admin._id},
    {title:'Probar CRUD en ambos clientes',description:'Crear en Angular y consultar en React',status:TaskStatus.PROGRESS,owner:admin._id},
    {title:'Revisar fechas de entrega',description:'Anotar las actividades de la semana',status:TaskStatus.PENDING,owner:admin._id}
   ]);
 }
 console.log('Datos de prueba verificados: administrador y tres tareas como máximo.');
 await mongoose.disconnect();
}
seed().catch(e=>{console.error(e);process.exit(1)});
