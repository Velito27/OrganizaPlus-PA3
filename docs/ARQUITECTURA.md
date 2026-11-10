# Arquitectura del sistema

**Patrón:** clientes SPA separados, servicio HTTP REST centralizado, colección MongoDB por tipo de entidad.

```text
                       HTTPS / navegador
     Angular 16                             React 18
 [HttpClient, ReactiveForms]          [Fetch, Hooks, Context API]
     [Guard, Interceptor]              [Guard, React Router]
             \                            /
               \      JSON/REST         /
                  Express + Node.js
                /auth  /tasks  /admin
                 middleware JWT/roles
                  Zod + Mongoose
                    MongoDB
                users       tasks
```

**Modelo `users`:** `_id:ObjectId`, `name:String`, `email:String(unique)`, `passwordHash:String`, `role:'user'|'admin'`, `tokenVersion:Number`, fechas de creación y actualización. La contraseña nunca se almacena como texto claro.

**Modelo `tasks`:** `_id:ObjectId`, `title:String`, `description:String`, `status:enum`, `dueDate:Date|null`, `owner:ObjectId->users`, marcas de tiempo. La relación N:1 entre tareas y usuarios permite aislamiento por propietario.

**Flujo de sesión:** el usuario envía credenciales, la API compara el hash con bcrypt y emite JWT HS256 de 1 hora con `sub` y `version`. El middleware valida firma, audiencia, emisor, tiempo de expiración y `tokenVersion` actualizado en MongoDB. El navegador guarda el token en `sessionStorage` y lo adjunta a cada petición. El cierre de sesión incrementa la versión y revoca todos los tokens previos. No existe refresh token en esta versión académica.

**Autorización:** solo el servidor decide si un usuario puede consultar o cambiar una tarea. Para rol `user` la búsqueda incorpora `owner=idUsuario`; el administrador ve todas las tareas y puede abrir `/admin/users`. No se admite escoger un `owner` arbitrario en POST/PUT/PATCH.

**Seguridad complementaria:** Helmet, CORS de lista blanca, límite de peticiones en `/auth`, límites JSON, esquemas Zod estrictos, control de ObjectId y errores sin exponer trazas técnicas a usuarios.

**Datos compartidos:** MongoDB debe estar activo para que la API funcione. Angular y React consultan al mismo servidor; si se modifica una tarea en una interfaz, el cambio aparece en la otra cuando se vuelve a cargar la lista. No se utiliza actualización en tiempo real.

**Detalles a considerar:** el listado devuelve hasta 200 tareas por consulta y la sesión vence según el tiempo del token. El JWT se guarda en `sessionStorage`. Para un sistema de uso real sería mejor actualizar dependencias y reforzar el manejo de sesiones.
