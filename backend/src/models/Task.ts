import { Schema, model, type InferSchemaType } from 'mongoose';
import { TaskStatus } from '../types';
const schema = new Schema({
  title: { type: String, required:true, trim:true, minlength:3, maxlength:120 },
  description: { type:String, default:'', maxlength:1000 },
  status: { type:String, required:true, enum:Object.values(TaskStatus), default: TaskStatus.PENDING },
  dueDate: { type:Date, default:null },
  owner: {type:Schema.Types.ObjectId, ref:'User', required:true, index:true }
},{timestamps:true});
export type TaskDocument = InferSchemaType<typeof schema>;
export const Task = model('Task',schema);
