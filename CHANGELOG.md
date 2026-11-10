# Bitácora de cambios - PA3

## 09/11/2026 - Versión 1.0

### Gestión de tareas
- CRUD de tareas: registrar, ver, editar y eliminar.
- Modelo de tareas guardadas en MongoDB.
- Pantallas en Angular para el listado, dashboard y formulario.

### Usuarios, seguridad y panel React
- Se añadieron el registro y el inicio de sesión con bcrypt y JWT.
- Se separaron las tareas por usuario y se agregó el permiso de administrador.
- Se creó el panel de React para consultar y modificar las mismas tareas.
- Context API para compartir la sesión entre componentes de React.
- Se agregaron validaciones en los formularios y en la API.
- Se organizó la configuración para usar MongoDB, Express, Angular y React con Docker.

### Organización y correcciones del código
- Separación de rutas, controladores, modelos y servicios.
- Manejo de errores con respuestas JSON y codigos HTTP.
- Validación de IDs antes de modificar una tarea.
- Protección de rutas de administración desde el servidor.
- Se incluyeron pruebas para revisar funciones y operaciones de la API.

### Revisión del proyecto
Las pruebas se pueden ejecutar con `npm test` dentro de `backend` y con `node scripts/smoke.mjs` desde la carpeta principal. Para revisar ambas interfaces se usa el mismo usuario en Angular y React, asi se comprueba que comparten las tareas guardadas.
