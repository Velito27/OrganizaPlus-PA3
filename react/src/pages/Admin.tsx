import {useEffect,useState} from 'react';
import {api} from '../api';
import type {User} from '../types';
export function Admin(){
 const [users,setUsers]=useState<User[]>([]);const [error,setError]=useState('');
 useEffect(()=>{let alive=true;api.users().then(r=>{if(alive)setUsers(r.data);}).catch(e=>{if(alive)setError(e instanceof Error?e.message:'Error');});return()=>{alive=false;};},[]);
 return <><div className="page-head"><div><span className="eyebrow">ACCESO POR ROL</span><h1>Administración</h1><p className="muted">Esta ruta necesita un usuario administrador y autorización en el servidor.</p></div></div>
 {error&&<p className="alert error">{error}</p>}
 <section className="panel table-panel"><h2>Usuarios registrados</h2><div className="table-scroll"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td><span className="status">{u.role}</span></td></tr>)}</tbody></table></div></section></>;
}
