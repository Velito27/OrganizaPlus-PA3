import { Schema, model, type InferSchemaType } from 'mongoose';
import { Role } from '../types';
const schema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: Object.values(Role), default: Role.USER, required: true },
  tokenVersion: { type: Number, default: 0, required: true }
}, {timestamps:true});
export type UserDocument = InferSchemaType<typeof schema>;
export const User = model('User',schema);
