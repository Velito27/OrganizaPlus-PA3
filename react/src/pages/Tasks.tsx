import {useEffect,useState} from 'react';
import {Link,useLocation} from 'react-router-dom';
import {api} from '../api';
import {useAuth} from '../AuthContext';
import type {Task} from '../types';
const label:Record<Task['status'],string>={pendiente:'Pendiente',en_progreso:'En progreso',completada:'Completada'};
export function Tasks(){
 const {user}=useAuth();const location=useLocation();const [tasks,setTasks]=useState<Task[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [message,setMessage]=useState(location.state?.saved?`Tarea ${location.state.saved} correctamente`:'');
 async function refresh(){setLoading(true);setError('');try{const r=await api.tasks();setTasks(r.data);}catch(e){setError(e instanceof Error?e.message:'No se pudo cargar');}finally{setLoading(false);}}
 useEffect(()=>{void refresh();},[]);
 async function remove(t:Task){if(!window.confirm(`¿Eliminar la tarea "${t.title}"?`))return;try{await api.remove(t.id);setMessage('Tarea eliminada correctamente');await refresh();}catch(e){setError(e instanceof Error?e.message:'No se pudo eliminar');}}
 return <><div className="page-head"><div><span className="eyebrow">REGISTROS PERSISTENTES</span><h1>{user?.role==='admin'?'Todas las tareas':'Mis tareas'}</h1><p className="muted">Consultar, editar y eliminar desde React.</p></div><Link to="/tareas/nueva" className="btn btn-primary">+ Nueva tarea</Link></div>
 {message&&<p className="alert success" role="status">{message}</p>}{error&&<p className="alert error" role="alert">{error}</p>}
 <section className="panel table-panel"><div className="table-top"><h2>Listado de tareas</h2><button className="btn btn-outline small" onClick={()=>void refresh()}>Actualizar</button></div>
 {loading?<p className="muted">Cargando desde MongoDB...</p>:tasks.length===0?<p className="empty">Todavía no hay tareas. Crea la primera para comenzar.</p>:<div className="table-scroll"><table><thead><tr><th>Tarea</th><th>Estado</th><th>Vencimiento</th><th>Acciones</th></tr></thead><tbody>
 {tasks.map(t=><tr key={t.id}><td><strong>{t.title}</strong><small>{t.description||'Sin descripción'}</small></td><td><span className={`status ${t.status}`}>{label[t.status]}</span></td><td>{t.dueDate||'Sin fecha'}</td><td><div className="actions"><Link to={`/tareas/${t.id}/editar`} className="btn btn-ghost small">Editar</Link><button onClick={()=>void remove(t)} className="btn btn-danger small">Eliminar</button></div></td></tr>)}
 </tbody></table></div>}</section></>;
}
