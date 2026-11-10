# Organiza+ - Gestión de tareas (PA3)

Organiza+ permite crear tareas, ponerles una fecha, cambiar su estado y eliminarlas. También tiene registro e inicio de sesión. La pantalla principal está hecha con Angular 16 y hay un segundo panel en React; los dos consultan las mismas tareas mediante el servidor de Express y MongoDB.

## Aplicación en línea

- Angular (principal): https://angular-production-2a00.up.railway.app
- React (panel secundario): https://react-production-2a1d.up.railway.app
- API (estado): https://backend-production-fff57.up.railway.app/api/health

Las dos páginas usan la misma API y los datos quedan guardados en MongoDB.

## Cómo iniciar el proyecto

La forma más sencilla en Windows es con **Docker Desktop**. Hay que tenerlo instalado y abierto antes de empezar. Luego se descomprime la carpeta del proyecto y se abre PowerShell dentro de esa carpeta (donde está `docker-compose.yml`).

Se escribe este comando:

```powershell
.\INICIAR_WINDOWS.ps1
```

El archivo prepara la clave del servidor si es la primera vez y arranca MongoDB, el backend y las dos páginas. La primera vez puede tardar porque Docker tiene que descargar e instalar varias cosas. Es necesario estar conectado a internet.

Cuando termine, las direcciones son:

- **Angular:** http://localhost:4200
- **React:** http://localhost:5173
- **Servidor:** http://localhost:4000/api/health

En Angular se puede crear una cuenta y entrar a gestionar tareas. Esa misma cuenta sirve en React. Por ejemplo, se puede agregar una tarea en Angular y verla en React al actualizar la lista.

Para apagarlo, desde la misma carpeta se utiliza:

```powershell
docker compose down
```

Esto detiene el proyecto, pero conserva las tareas guardadas. Evitar `docker compose down -v` porque ese comando también borra el volumen de MongoDB.

### Si PowerShell no deja ejecutar el archivo

No es necesario cambiar la seguridad de Windows. También se puede arrancar Docker manualmente:

1. Copiar el archivo `.env.example` con el nombre `.env`.
2. Abrir `.env` y completar `JWT_SECRET` con una clave privada de 32 caracteres como mínimo.
3. Volver a PowerShell y ejecutar los comandos.

```powershell
Copy-Item .env.example .env
```

Para crear una clave aleatoria se puede usar este comando si se tiene Node.js instalado:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Se pega el resultado después de `JWT_SECRET=` en `.env`. Después:

```powershell
docker compose up --build -d
docker compose ps
```

Si alguna página no abre, conviene revisar que Docker Desktop esté encendido y ver qué servicio falló con `docker compose logs`.

## Usuarios de prueba

El registro normal crea usuarios con permiso `user`. Para probar también el apartado de administrador hay un comando que crea esa cuenta y tres tareas de ejemplo. Se ejecuta cuando Docker ya esté funcionando:

```powershell
docker compose exec -e SEED_ADMIN_EMAIL=admin@example.com -e SEED_ADMIN_PASSWORD=TU_CLAVE_LARGA_Y_PRIVADA backend npm run seed:prod
```

En `TU_CLAVE_LARGA_Y_PRIVADA` hay que colocar una contraseña propia de al menos 12 caracteres. No se debe dejar esa contraseña escrita en los archivos que se suban al repositorio. El comando no cambia el rol de las cuentas normales ya creadas.

## Iniciar sin Docker

También se puede ejecutar por partes, aunque hay que tener MongoDB instalado o disponible en el puerto `27017`. Si se usa Docker solamente para la base de datos, desde la carpeta principal sirve `docker compose up -d mongo`.

Para el backend se usa **Node.js 22**. En una terminal:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

Antes de iniciarlo hay que poner una clave propia en `JWT_SECRET` dentro de `backend/.env`.

Angular 16 necesita **Node.js 18**. Desde otra terminal, ubicada en la carpeta principal:

```powershell
cd angular
npm install
npm start
```

Para React se utiliza **Node.js 20 o 22**. En otra terminal desde la carpeta principal:

```powershell
cd react
Copy-Item .env.example .env
npm install
npm run dev
```

Por la diferencia de versiones de Node, para esta entrega resulta más cómodo usar Docker y evitar cambiar de versión entre aplicaciones.

## Qué incluye el proyecto

El backend usa Node.js, Express, Mongoose, bcrypt y JWT. Tiene rutas para cuentas y tareas, validaciones, permisos de usuario y administrador. Angular incluye los formularios y el listado principal. React utiliza React Router, Hooks y Context API para mantener la sesión entre sus páginas.

Las carpetas están separadas para que sea más sencillo encontrar cada parte:

```text
angular/                 Página principal
react/                   Panel adicional
backend/                 API y conexión a MongoDB
docs/                    Endpoints, arquitectura, pruebas y publicación
scripts/smoke.mjs        Prueba básica de la API
CHANGELOG.md             Cambios del proyecto
informe_tecnico.pdf      Informe
banco_22_ejercicios.pdf Ejercicios
```

## Pruebas

Con el backend instalado, dentro de `backend` se puede ejecutar:

```powershell
npm test
```

Con Docker y la API funcionando, desde la carpeta principal:

```powershell
node scripts/smoke.mjs
```

El segundo comando revisa el registro de usuarios, las operaciones de tareas y el cierre de sesión. También están los casos para probarlo a mano en `docs/PRUEBAS_Y_EVIDENCIAS.md`.

## API

Estas son las rutas principales. Las que piden iniciar sesión se envían con el encabezado `Authorization: Bearer <token>`.

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/api/health` | Público |
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/auth/me` | Usuario conectado |
| POST | `/api/auth/logout` | Usuario conectado |
| GET / POST | `/api/tasks` | Usuario conectado |
| GET | `/api/tasks/summary` | Usuario conectado |
| GET / PUT / PATCH / DELETE | `/api/tasks/:id` | Dueño de la tarea o administrador |
| GET | `/api/admin/users` | Administrador |
| GET | `/api/admin/metrics` | Administrador |

En `docs/ENDPOINTS.md` están las rutas con más detalle. Para publicar el proyecto se incluyen las indicaciones de `docs/DESPLIEGUE.md`. Los archivos `.env` con contraseñas reales no deben subirse a GitHub.

## Referencias

- Angular, versiones compatibles: https://angular.dev/reference/versions
- Express, seguridad: https://expressjs.com/advanced/best-practice-security/
- Mongoose, validaciones: https://mongoosejs.com/docs/validation.html
