import { createContext,useContext,useEffect,useState,type ReactNode } from 'react';
import { api, tokenStore } from './api';
import type { User } from './types';
type AuthContextType={user:User|null;loading:boolean;signIn:(email:string,password:string)=>Promise<void>;signUp:(name:string,email:string,password:string)=>Promise<void>;signOut:()=>Promise<void>};
const AuthContext=createContext<AuthContextType|null>(null);
export function AuthProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<User|null>(null);const [loading,setLoading]=useState(true);
 useEffect(()=>{
  let mounted=true;
  function invalid(){if(mounted)setUser(null);}
  window.addEventListener('pa3:unauthorized',invalid);
  if(tokenStore.get())api.me().then(r=>{if(mounted)setUser(r.data);}).catch(()=>{if(mounted){tokenStore.clear();setUser(null);}}).finally(()=>{if(mounted)setLoading(false);});
  else setLoading(false);
  return()=>{mounted=false;window.removeEventListener('pa3:unauthorized',invalid);};
 },[]);
 const signIn=async(email:string,password:string)=>{const r=await api.login(email,password);tokenStore.set(r.data.token);setUser(r.data.user);};
 const signUp=async(name:string,email:string,password:string)=>{const r=await api.register(name,email,password);tokenStore.set(r.data.token);setUser(r.data.user);};
 const signOut=async()=>{try{if(tokenStore.get())await api.logout();}catch{/* Limpiar también si el servidor no responde */}finally{tokenStore.clear();setUser(null);}};
 return <AuthContext.Provider value={{user,loading,signIn,signUp,signOut}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error('Falta AuthProvider');return value;}
