# Arquitectura de automatización y competencias técnicas — Demo PXSOL

**Estado:** especificación de implementación para demo local/controlada.  
**Fuente de verdad:** Supabase.  
**Orquestador principal previsto:** n8n Community autohospedado.  
**Alternativa complementaria:** Make Free (máximo dos escenarios activos; consumo sujeto a créditos).  
**Datos:** exclusivamente ficticios. No enviar comunicaciones reales.

## 1. Objetivo demostrable

La demo debe evidenciar capacidades ejecutables, no solo mencionar herramientas:

- AI & Workflows: workflows n8n ejecutables y un asistente IA que razona sobre datos reales del entorno ficticio.
- Code & APIs: integración HTTP autenticada y script Python con validaciones y pruebas.
- n8n: instancia Community, workflows exportables, manejo de errores y trazabilidad.
- MCP: cliente MCP que invoque herramientas de lectura del onboarding mediante Model Context Protocol.

No se debe presentar un workflow exportado como integración desplegada. La instancia n8n, credenciales, ejecución y evidencia deben validarse antes de afirmar que una capacidad está operativa.

## 2. Arquitectura

```text
Next.js Onboarding Hub
        |
        | evento normalizado (HTTPS)
        v
Automation API (server-side)
        |
        +---- n8n Community (principal)
        |       +-- WF-01 alta / validación
        |       +-- WF-02 asistente IA
        |       +-- WF-03 seguimiento / bloqueadores
        |
        +---- Make Free (escenario demostrativo alternativo)
        |
        +---- MCP Server (herramientas read-only)
        |
        +---- Python (validación / transformación)
        |
        v
Supabase (estado persistente y fuente de verdad)
```

La aplicación conserva la lógica de negocio y permisos. n8n/Make orquestan; no son la fuente de verdad ni deben poder alterar directamente tablas sensibles. Los endpoints server-side verifican sesión o firma de servicio, validan esquema, aplican idempotencia y escriben auditoría.

## 3. Contrato de eventos

Evento mínimo:

```json
{
  "event": "onboarding.client_created",
  "event_id": "uuid",
  "client_id": "uuid",
  "environment": "demo",
  "occurred_at": "2026-11-01T12:00:00.000Z",
  "schema_version": 1
}
```

Reglas:
- `event_id` es obligatorio y único; los reintentos reutilizan el mismo ID.
- `client_id` debe corresponder a un cliente ficticio del entorno demo.
- Rechazar eventos de otros entornos.
- No incluir email, contraseña, tokens, datos de huéspedes ni información sensible en el payload.
- Firmar llamadas servidor-a-servidor; no confiar en un secreto enviado desde el navegador.
- Responder 202 solo después de persistir o encolar el evento de forma durable.
- Registrar correlation ID, estado, timestamps, intentos y error sanitizado.

## 4. Workflows n8n

### WF-01 — Alta y validación
1. Webhook HTTPS recibe `onboarding.client_created`.
2. Valida schema_version, event_id, client_id y environment.
3. Consulta el endpoint interno de estado del onboarding.
4. Verifica que existan exactamente 20 pasos esperados.
5. Escribe resultado en endpoint de auditoría.
6. Devuelve estado y correlation ID.

### WF-02 — AI Onboarding Assistant
1. Recibe solicitud autenticada para un cliente ficticio.
2. Obtiene estado, pasos pendientes y bloqueadores por API.
3. El modelo clasifica bloqueadores y propone el siguiente paso.
4. Responde JSON estructurado con evidencias y explicación.
5. Registra modelo, versión de prompt, resultado y duración.

El agente es consultivo: no cambia estados, no crea usuarios, no envía mensajes y no inventa métricas. Toda recomendación debe referenciar pasos existentes.

### WF-03 — Seguimiento
1. Consume evento de cambio de estado.
2. Recalcula progreso desde los pasos persistidos.
3. Identifica bloqueadores activos y tareas vencidas solo si existe fecha válida.
4. Registra resultado y genera una alerta visible en la demo.
5. Reintenta errores transitorios con límite y backoff; errores permanentes van a dead-letter/manual review.

## 5. API y seguridad

Endpoints propuestos (no afirmar disponibles hasta implementarlos y probarlos):
- `POST /api/automation/events`: ingreso autenticado de eventos.
- `GET /api/automation/clients/:id/status`: lectura del estado.
- `POST /api/automation/runs`: registrar inicio/resultado de ejecución.
- `GET /api/automation/runs/:correlationId`: consultar trazabilidad.
- `GET /api/mcp`: transporte MCP HTTP si se decide desplegar MCP en Next.js; alternativa inicial: MCP stdio local.

Controles:
- Supabase Auth y RLS deben autorizar cada lectura/escritura.
- Nunca exponer service_role, claves de proveedor o credenciales n8n al navegador.
- Separar secreto de webhook de n8n del secreto de firma de API.
- Validar HMAC con timestamp y protección anti-replay; rotar secretos.
- Rate limit, tamaño máximo, timeout, idempotencia y allowlist de eventos.
- Redactar PII y secretos de logs.
- MCP expone inicialmente solo herramientas de lectura: `get_onboarding_status`, `list_pending_steps`, `get_client_blockers`, `get_workflow_history`.
- No publicar herramientas de escritura hasta tener roles y RLS por rol verificados.

## 6. Python

El script `scripts/validate_demo_payload.py` valida el contrato de evento y la presencia de los 20 pasos. Se ejecuta localmente/CI con datos ficticios y sin credenciales. Las pruebas Python deben cubrir payload válido, campos ausentes, entorno incorrecto, UUID inválido y cantidad incorrecta de pasos.

## 7. Make Free

Make se utiliza como comparativa y alternativa, no como motor principal:
- Escenario 1: webhook → validación → HTTP al endpoint de demo → respuesta.
- Escenario 2: evento de bloqueo → clasificación/regla → registro.
- Controlar consumo: cada módulo/acción puede consumir créditos; no ejecutar polling frecuente.
- No duplicar eventos ni conectar canales reales.
- Documentar consumo por ejecución de prueba y límite disponible al momento de la presentación.

## 8. Criterios de aceptación

- [ ] n8n Community levantado y versión registrada.
- [ ] WF-01 importado, activo en entorno demo y probado con webhook real.
- [ ] Evento duplicado no produce efectos duplicados.
- [ ] WF-02 consulta datos del onboarding y devuelve JSON verificable.
- [ ] WF-03 registra bloqueadores y errores; reintentos acotados.
- [ ] Python script y tests ejecutados en CI.
- [ ] Cliente MCP conecta e invoca al menos tres herramientas read-only.
- [ ] Ninguna credencial privilegiada queda en cliente o repositorio.
- [ ] Trazabilidad visible desde correlation ID hasta resultado.
- [ ] Make Free ejecuta un escenario y se mide consumo de créditos.
- [ ] Datos ficticios; cero comunicaciones reales.
- [ ] QA funcional y seguridad completados antes de la presentación.

## 9. Dependencias y bloqueos reales

- La aplicación actual aún no tiene Automation API ni MCP server; esta especificación no implica que estén desplegados.
- Las policies actuales de Supabase permiten acceso compartido a usuarios autenticados y no distinguen admin/onboarder. No exponer herramientas MCP ni endpoints privilegiados hasta cerrar autorización por rol.
- La instancia n8n requiere infraestructura, dominio/URL accesible, HTTPS, cifrado de credenciales, persistencia, backups y una clave de cifrado estable. No guardar secretos en GitHub.
- No aplicar migraciones remotas, cambiar Auth/RLS, activar workflows externos ni realizar comunicaciones reales sin el gate correspondiente.
