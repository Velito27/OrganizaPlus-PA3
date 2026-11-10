import mongoose from 'mongoose';
import { app } from './app';
import { config } from './config';
async function start(){
  await mongoose.connect(config.MONGODB_URI,{serverSelectionTimeoutMS:10000});
  console.log('MongoDB conectado');
  const server=app.listen(config.PORT,()=>console.log(`API: http://localhost:${config.PORT}/api/health`));
  const stop=async()=>{server.close();await mongoose.disconnect();process.exit(0);};
  process.on('SIGTERM',stop);process.on('SIGINT',stop);
}
start().catch(err=>{console.error('No se pudo iniciar el servidor:',err);process.exit(1)});
