import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

const configSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  MONGODB_URI: z.string().min(10),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1h'),
  ALLOWED_ORIGINS: z.string().min(1)
});
const parsed = configSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Configuración incorrecta: revise .env y variables de entorno.', parsed.error.flatten().fieldErrors);
  process.exit(1);
}
export const config = parsed.data;
export const allowedOrigins = config.ALLOWED_ORIGINS.split(',').map(x => x.trim()).filter(Boolean);
