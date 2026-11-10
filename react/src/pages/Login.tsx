import {useState,type FormEvent} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../AuthContext';
export function Login({register=false}:{register?:boolean}){
 const {signIn,signUp}=useAuth();const navigate=useNavigate();
 const [name,setName]=useState('');const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();if(password.length<8 || (register&&name.trim().length<2)){setError('Nombre o contraseña inválidos (8 caracteres mínimo)');return;}
  setBusy(true);setError('');try{if(register)await signUp(name,email,password);else await signIn(email,password);navigate('/');}catch(e){setError(e instanceof Error?e.message:'Error de acceso');}finally{setBusy(false);}}
 return <section className="auth-wrap"><div className="panel auth-panel"><span className="eyebrow">ACCESO SEGURO</span>
  <h1>{register?'Crear cuenta':'Bienvenido de nuevo'}</h1><p className="muted">{register?'Registra tu usuario para organizar tareas.':'Ingresa con tu correo y contraseña.'}</p>
  <form onSubmit={e=>void submit(e)}>{register&&<label>Nombre<input autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre"/></label>}
   <label>Correo electrónico<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="nombre@correo.com"/></label>
   <label>Contraseña<input type="password" autoComplete={register?'new-password':'current-password'} required minLength={8} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 8 caracteres"/></label>
   {error&&<p className="alert error" role="alert">{error}</p>}
   <button className="btn btn-primary full" disabled={busy}>{busy?'Procesando...':register?'Registrarme':'Iniciar sesión'}</button>
  </form><p className="muted text-center"><Link to={register?'/ingresar':'/registro'}>{register?'Ya tengo cuenta':'Crear una cuenta'}</Link></p></div></section>;
}
