import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {api} from '../api';
import type {Summary} from '../types';
export function Dashboard(){
 const [summary,setSummary]=useState<Summary|null>(null);const [error,setError]=useState('');
 useEffect(()=>{let alive=true;api.summary().then(r=>{if(alive)setSummary(r.data);}).catch(e=>{if(alive)setError(e instanceof Error?e.message:'Error');});return()=>{alive=false;};},[]);
 return <><div className="page-head"><div><span className="eyebrow">VISTA GENERAL</span><h1>Panel secundario</h1><p className="muted">Datos obtenidos directamente del backend de MongoDB.</p></div><Link className="btn btn-primary" to="/tareas/nueva">+ Agregar tarea</Link></div>
 {error&&<p className="alert error">{error}</p>}
 <div className="stats-grid">{([['Pendientes',summary?.pendiente,'Por comenzar'],['En progreso',summary?.en_progreso,'En desarrollo'],['Completadas',summary?.completada,'Terminadas']] as const).map(([name,n,sub])=><div className="stat" key={name}><div className="stat-label">{name}</div><div className="stat-number">{n??'—'}</div><small>{sub}</small></div>)}</div>
 <section className="panel information"><h2>Sincronizado con Angular</h2><p className="muted">Este panel utiliza React Router, Hooks y Context API para el estado de autenticación. Las tareas provienen del mismo servidor que utiliza Angular.</p><Link to="/tareas" className="btn btn-outline">Gestionar tareas</Link></section></>;
}
