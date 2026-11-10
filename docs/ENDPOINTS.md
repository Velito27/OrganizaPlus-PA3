# Contratos de API

**Base:** `http://localhost:4000/api` en local. En producción cambiar por la URL HTTPS real.

## Autenticación

- **POST `/auth/register`**: `{ "name": "Ana", "email": "ana@example.com", "password": "clave_segura_123" }` → 201, `{data:{user:{id,name,email,role},token}}`. El rol asignado es siempre `user`; un `role` enviado en el cuerpo causa 400.
- **POST `/auth/login`**: `{ "email": "ana@example.com", "password": "clave_segura_123" }` → 200, token y usuario; credenciales erróneas → 401.
- **GET `/auth/me`**: token requerido; devuelve `{data:{id,name,email,role}}`.
- **POST `/auth/logout`**: invalida los tokens anteriores del mismo usuario mediante `tokenVersion` persistido. Requiere Bearer JWT.

## Tareas

**Datos válidos:**

```json
{
  "title": "Preparar evaluación",
  "description": "Corregir formulario antes de entregar",
  "status": "en_progreso",
  "dueDate": "2026-12-01"
}
```

- `title`: texto 3–120 caracteres.
- `description`: texto 0–1000 caracteres.
- `status`: `pendiente`, `en_progreso`, `completada`.
- `dueDate`: `YYYY-MM-DD` o `null`; se devuelve fecha sin hora.
- `owner`: siempre se obtiene del usuario autenticado, nunca del cuerpo recibido.

| Ruta | Descripción | Éxito |
|---|---|---|
| GET `/tasks` | Hasta 200 tareas, las propias para `user` o todas para `admin`. | 200 |
| GET `/tasks/summary` | Recuento por estado del mismo conjunto visible. | 200 |
| GET `/tasks/:id` | Detalle si corresponde al usuario o administrador. | 200 |
| POST `/tasks` | Crear tarea con JSON validado. | 201 |
| PUT `/tasks/:id` | Sustituir atributos editables, todos requeridos excepto valores por defecto. | 200 |
| PATCH `/tasks/:id` | Cambiar una parte de los atributos. | 200 |
| DELETE `/tasks/:id` | Eliminar una tarea accesible. | 200 |
| GET `/admin/users` | Listar hasta 200 usuarios, solo `admin`. | 200 |
| GET `/admin/metrics` | Contar usuarios y tareas, solo `admin`. | 200 |

**Errores:** validación/ID inválido 400; JWT ausente, vencido o revocado 401; rol insuficiente 403; recurso inexistente o fuera de alcance 404; correo duplicado 409; falla inesperada 500.

## Ejemplo de solicitud

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ana@example.com","password":"clave_segura_123"}'
# Copiar token de la respuesta de forma privada:
curl http://localhost:4000/api/tasks -H 'Authorization: Bearer TOKEN_AQUI'
```

La API no acepta identidades ni roles enviados por el navegador como prueba de autorización: la identidad real siempre proviene del JWT validado y de MongoDB.
