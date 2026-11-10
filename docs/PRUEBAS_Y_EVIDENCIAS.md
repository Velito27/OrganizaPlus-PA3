# Pruebas del sistema

Estos casos sirven para revisar las funciones principales y tomar las capturas durante la presentación. El orden empieza con el registro y termina con la comprobación de permisos y persistencia.

## Prueba de integración automatizada

1. Levantar MongoDB y backend.
2. Ejecutar `node scripts/smoke.mjs` desde la raíz.
3. Anotar salida y captura de consola.

Comprueba: health, registro 201, consulta autenticada, creación 201, lista, detalle, actualización, restricción de administrador 403, eliminación, 404 posterior a borrar, logout y token revocado 401.

## Pruebas manuales y evidencia gráfica

| Nº | Acción | Resultado esperado | Evidencia |
|---|---|---|---|
| 1 | Abrir Angular e iniciar sesión | Dashboard visible, nombre del usuario | Angular - dashboard |
| 2 | Registrar cuenta nueva | Cuenta creada con rol user | Registro |
| 3 | Agregar tarea desde Angular | Se añade a MongoDB y aparece en la lista | Angular - crear |
| 4 | Abrir React con el mismo usuario y recargar | La tarea previa aparece | React - lista |
| 5 | Modificar estado en React | En Angular, tras actualizar, se ve el nuevo estado | React - editar; Angular - lista |
| 6 | Eliminar en Angular | Requiere confirmación y desaparece tras aceptar | Angular - eliminar |
| 7 | Mandar título de 2 caracteres | Formulario o API rechaza 400 | Error de validación |
| 8 | Abrir ruta `/admin` como user | Se bloquea y API devuelve 403 | Respuesta API |
| 9 | Ingresar como admin de seed | Aparece panel administrativo con usuarios | Admin |
| 10 | Cerrar sesión | Token invalidado, rutas protegidas inaccesibles | Login posterior |
| 11 | Reiniciar MongoDB o backend y volver a listar | Las tareas no eliminadas siguen guardadas | Lista tras reinicio |
| 12 | Acceder con token falso o expirado | HTTP 401; React solicita nuevo login | Red y login |

## Enlaces para la publicación

Los enlaces públicos de Angular, React, API y repositorio se agregan aquí una vez que se suba el proyecto. En local se utilizan `http://localhost:4200`, `http://localhost:5173` y `http://localhost:4000/api/health`.

## Revisión final

- [ ] `docker compose up --build -d` finaliza correctamente.
- [ ] `npm test` devuelve resultado positivo.
- [ ] `node scripts/smoke.mjs` confirma CRUD + auth.
- [ ] Capturas reales de las operaciones anteriores insertadas en el informe PDF.
- [ ] URL HTTPS de Angular, React y API funcionan públicamente.
- [ ] GitHub/GitLab contiene código, README y CHANGELOG; no contiene `.env`.
- [ ] Se comprueba que las contraseñas de prueba no sean reutilizadas en cuentas personales.
