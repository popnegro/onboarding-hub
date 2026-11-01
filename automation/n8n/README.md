# n8n — PXSOL demo

## WF-00: Event Contract Validation

Archivo importable: `wf-00-event-contract-validation.json`.

Este workflow demuestra recepción webhook, validación de contrato, rechazo de payloads inválidos y respuesta HTTP. Está exportado como **inactivo** y no contiene credenciales.

### Importación segura

1. Instalar n8n Community en un entorno controlado.
2. Configurar una clave de cifrado persistente (`N8N_ENCRYPTION_KEY`) y almacenamiento persistente antes de guardar credenciales.
3. Importar el JSON desde Workflows → Import from File.
4. Crear una credencial Header Auth dedicada para el webhook.
5. Configurar autenticación en el nodo Webhook antes de activarlo.
6. Restringir acceso HTTPS y no publicar el editor sin autenticación.
7. Probar primero con payload ficticio válido y luego con entorno incorrecto/UUID inválido.
8. Comprobar execution data y respuesta HTTP; no incluir PII ni secretos.

### Payload de prueba

```json
{
  "event": "onboarding.client_created",
  "event_id": "8b3f9e42-2a1c-4d77-9b32-1e7f2c5a8d10",
  "client_id": "6a8d4c21-7f30-4a92-8b15-3c9d6e2f1048",
  "environment": "demo",
  "occurred_at": "2026-11-01T12:00:00.000Z",
  "schema_version": 1
}
```

Respuesta esperada válida: HTTP 202 con `accepted: true`. Un evento de otro environment, UUID inválido o campo sensible debe rechazarse.

### Límite funcional actual

WF-00 valida el contrato de entrada; todavía **no** consulta Supabase ni ejecuta el alta del cliente. La integración real requiere implementar Automation API, firma servidor-a-servidor, idempotencia persistida y autorización por rol. No presentar WF-00 como un onboarding automatizado end-to-end.
