// Prueba de integración real: requiere API y MongoDB en ejecución.
const base=process.env.API_URL||'http://localhost:4000/api';
const suffix=Date.now().toString(36);
const email=`prueba-${suffix}@example.test`;
const password=`Prueba_${suffix}_1234`;
let token='';
async function call(path,method='GET',body,expected=200){
 const res=await fetch(`${base}${path}`,{
  method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},
  ...(body?{body:JSON.stringify(body)}:{})
 });
 const data=await res.json();
 if(res.status!==expected)throw new Error(`${method} ${path}: esperaba ${expected}, recibió ${res.status}: ${JSON.stringify(data)}`);
 console.log('OK',method,path,res.status);return data;
}
async function run(){
 await call('/health');
 const register=await call('/auth/register','POST',{name:'Prueba Técnica',email,password},201);
 token=register.data.token;
 await call('/auth/me');
 const payload={title:`Validar PA3 ${suffix}`,description:'Comprobar CRUD',status:'pendiente',dueDate:null};
 const task=await call('/tasks','POST',payload,201);const id=task.data.id;
 await call('/tasks');await call(`/tasks/${id}`);
 const ownerToken=token;
 const other=await call('/auth/register','POST',{name:'Segundo Usuario',email:`otro-${suffix}@example.test`,password},201);
 token=other.data.token;
 await call(`/tasks/${id}`,'GET',undefined,404);
 await call(`/tasks/${id}`,'DELETE',undefined,404);
 token=ownerToken;
 await call(`/tasks/${id}`,'PUT',{...payload,status:'completada'});
 const updated=await call(`/tasks/${id}`);
 if(updated.data.status!=='completada')throw new Error('No persistió actualización');
 await call('/admin/users','GET',undefined,403);
 await call(`/tasks/${id}`,'DELETE');
 await call(`/tasks/${id}`,'GET',undefined,404);
 await call('/auth/logout','POST');
 await call('/auth/me','GET',undefined,401);
 console.log('PRUEBA CRUD + AUTH + ROLES + REVOCACIÓN: COMPLETADA');
}
run().catch(e=>{console.error('PRUEBA FALLIDA:',e);process.exitCode=1;});
