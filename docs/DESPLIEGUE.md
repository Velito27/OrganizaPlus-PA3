# Publicación del proyecto

Esta parte es para subir Organiza+ a internet. En local se puede ejecutar todo con Docker, pero para publicarlo hacen falta una base de datos y un servicio para la API y cada pantalla.

## Base de datos

En MongoDB Atlas se crea un clúster y un usuario para la base de datos. La cadena de conexión se guarda en `MONGODB_URI` dentro de la configuración privada del servidor. No se coloca directamente en el código ni en GitHub. También se limita el acceso de red a las direcciones que se vayan a utilizar.

## Servidor

El backend se puede publicar con Render utilizando `render.yaml` o `backend/Dockerfile`. Hay que configurar `MONGODB_URI`, `JWT_SECRET`, `ALLOWED_ORIGINS`, `NODE_ENV=production`, `PORT=4000` y `JWT_EXPIRES_IN=1h`.

`ALLOWED_ORIGINS` debe tener las direcciones públicas de Angular y React separadas por una coma. Después de publicar el servidor se abre su dirección terminada en `/api/health` para comprobar que responda.

## Angular y React

Las dos páginas se pueden subir como servicios Docker usando los archivos `Dockerfile` de cada carpeta. Antes de compilar hay que indicar la dirección pública del backend:

| Página | Valores de compilación |
| --- | --- |
| Angular | `ANGULAR_API_URL` y `REACT_APP_URL` |
| React | `VITE_API_URL` y `VITE_ANGULAR_URL` |

Las direcciones deben usar HTTPS. Si el proveedor utiliza otro puerto para el contenedor, puede hacer falta ajustar la configuración de Nginx. También se pueden publicar los archivos compilados en un hosting estático que admita rutas SPA.

## Revisión

Al terminar se entra con la misma cuenta a las dos páginas. Se puede crear una tarea en Angular y comprobar que aparece en React. Hay que revisar que una cuenta normal no pueda abrir las rutas de administrador y que no se hayan subido contraseñas ni archivos `.env` privados.

Para las capturas de entrega se pueden usar los casos de `PRUEBAS_Y_EVIDENCIAS.md`.

Angular 16 se compila con Node.js 18 en este proyecto. La tabla de versiones está en https://angular.dev/reference/versions.
