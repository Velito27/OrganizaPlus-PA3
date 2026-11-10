import { Navigate,NavLink,Outlet,Route,Routes,useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { TaskForm } from './pages/TaskForm';
import { Admin } from './pages/Admin';
function Guard({admin=false}:{admin?:boolean}){
 const {user,loading}=useAuth();if(loading)return <main className="main">Verificando sesión...</main>;
 if(!user)return <Navigate to="/ingresar" replace/>;
 if(admin && user.role!=='admin')return <Navigate to="/" replace/>;
 return <Outlet/>;
}
function Layout(){
 const {user,signOut}=useAuth();const navigate=useNavigate();
 return <div className="shell"><aside className="sidebar">
  <NavLink className="logo" to="/"><span className="logo-icon">✓</span><span>Organiza<span className="accent">+</span><small>PA3 · React</small></span></NavLink>
  <nav className="nav">
   <NavLink to="/" end>⌂ &nbsp; Resumen</NavLink>
   <NavLink to="/tareas">▤ &nbsp; Mis tareas</NavLink>
   <NavLink to="/tareas/nueva">＋ &nbsp; Nueva tarea</NavLink>
   {user?.role==='admin'&&<NavLink to="/admin">♙ &nbsp; Administración</NavLink>}
   <a href={import.meta.env.VITE_ANGULAR_URL || "http://localhost:4200"} target="_blank" rel="noreferrer">↗ &nbsp; Panel Angular</a>
  </nav><div className="sidebar-bottom"><small>Una API. Dos interfaces.</small></div>
 </aside><div className="workspace"><header className="topbar"><div className="topbar-heading">Sistema de gestión de tareas <span className="tag">React</span></div>
  <div className="user-menu"><span>{user?.name}</span>{user?<button className="btn btn-ghost small" onClick={()=>void signOut().then(()=>navigate('/ingresar'))}>Salir</button>:<NavLink className="btn btn-ghost small" to="/ingresar">Ingresar</NavLink>}</div>
 </header><main className="main"><Outlet/></main></div></div>;
}
export function App(){return <Routes><Route element={<Layout/>}>
 <Route path="ingresar" element={<Login/>}/><Route path="registro" element={<Login register/>}/>
 <Route element={<Guard/>}><Route index element={<Dashboard/>}/><Route path="tareas" element={<Tasks/>}/><Route path="tareas/nueva" element={<TaskForm/>}/><Route path="tareas/:id/editar" element={<TaskForm/>}/></Route>
 <Route element={<Guard admin/>}><Route path="admin" element={<Admin/>}/></Route>
 <Route path="*" element={<Navigate to="/" replace/>}/>
 </Route></Routes>;
}
