# API de Profesores

API REST desplegable en Vercel con documentación Swagger en `/docs`.

## Variables de entorno en Vercel

Configura estas variables para los entornos `Preview` y `Production` desde el
panel de Vercel o con `vercel env add`. El archivo `.env` local no se publica
automáticamente durante el despliegue:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SSL_CERT` (opcional; ruta a un certificado CA disponible en el runtime)
- `DB_SSL_REJECT_UNAUTHORIZED` (opcional; por defecto `true`)
- `DB_CONNECTION_LIMIT` (opcional; por defecto `5`)

La conexión TLS está habilitada por defecto para servicios como TiDB Cloud.
Para una base local sin TLS se puede establecer `DB_SSL=false`.

## Rutas

- `/` muestra los enlaces principales de la API.
- `/docs` abre Swagger UI.
- `/openapi.json` devuelve la especificación OpenAPI.
- `/api/profesores` lista y crea profesores.
- `/api/profesores/:id` obtiene, actualiza o elimina un profesor.
