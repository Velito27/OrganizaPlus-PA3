import {useEffect,useState,type FormEvent} from 'react';
import {Link,useNavigate,useParams} from 'react-router-dom';
import {api} from '../api';
import type {TaskInput,TaskStatus} from '../types';
export function TaskForm(){
 const {id}=useParams();const navigate=useNavigate();const [title,setTitle]=useState('');const [description,setDescription]=useState('');const [status,setStatus]=useState<TaskStatus>('pendiente');const [dueDate,setDueDate]=useState('');const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 useEffect(()=>{if(!id)return;let alive=true;api.task(id).then(r=>{if(!alive)return;setTitle(r.data.title);setDescription(r.data.description);setStatus(r.data.status);setDueDate(r.data.dueDate||'');}).catch(e=>{if(alive)setError(e instanceof Error?e.message:'Error al cargar');});return()=>{alive=false;};},[id]);
 async function submit(e:FormEvent){e.preventDefault();if(title.trim().length<3){setError('El título debe tener al menos 3 caracteres');return;}
  const payload:TaskInput={title:title.trim(),description:description.trim(),status,dueDate:dueDate||null};
  setBusy(true);setError('');try{if(id)await api.update(id,payload);else await api.create(payload);navigate('/tareas',{state:{saved:id?'editada':'creada'}});}catch(e){setError(e instanceof Error?e.message:'Error al guardar');}finally{setBusy(false);}}
 return <><div className="page-head"><div><span className="eyebrow">FORMULARIO REACTIVO</span><h1>{id?'Editar tarea':'Nueva tarea'}</h1><p className="muted">Al guardar, se actualiza la colección de MongoDB.</p></div><Link className="btn btn-outline" to="/tareas">Volver</Link></div>
 <section className="panel form-panel"><form onSubmit={e=>void submit(e)}>
  <label>Título *<input required minLength={3} maxLength={120} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ej. Preparar presentación"/></label>
  <label>Descripción<textarea rows={4} maxLength={1000} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Detalles de la tarea"/></label>
  <div className="form-row"><label>Estado<select value={status} onChange={e=>setStatus(e.target.value as TaskStatus)}><option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option></select></label>
  <label>Fecha límite<input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}/></label></div>
  {error&&<p className="alert error" role="alert">{error}</p>}
  <div className="actions"><button className="btn btn-primary" disabled={busy}>{busy?'Guardando...':'Guardar tarea'}</button><Link className="btn btn-ghost" to="/tareas">Cancelar</Link></div>
 </form></section></>;
}
