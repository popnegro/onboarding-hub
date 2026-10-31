# Auditoría de contrato de datos y autorización — PXSOL Onboarding Hub

**Fecha:** 31/10/2026  
**Rama auditada:** `fix/vercel-build-supabase-types`  
**HEAD auditado:** `c91b240eb41f1efc6816f726d290946d6ecf5fdf`

## Alcance y límites

Revisión estática de `schema.sql`, `middleware.ts`, clientes Supabase, hooks de datos y componentes de edición. No se obtuvo acceso a un proyecto Supabase ni a una base de datos real. No se ejecutaron consultas, migraciones ni escrituras remotas.

## Hallazgos confirmados

### P0 — No habilitar acceso de usuarios ni datos reales

1. **No hay flujo de autenticación de aplicación.** No se encontraron páginas ni acciones de login/logout ni una comprobación de usuario autenticado en las rutas de aplicación.
2. **El middleware solo refresca cookies.** Ejecuta `auth.getUser()` cuando hay configuración, pero no inspecciona el resultado ni bloquea rutas privadas. Su comentario declara que la autorización queda pendiente.
3. **RLS está habilitado sin políticas** en `videos`, `clients`, `onboarding_steps`, `adoption_metrics` y `video_sends`. Esto aplica denegación por defecto a operaciones con la clave pública. Es seguro como postura provisional, pero las operaciones de negocio no funcionarán hasta crear políticas específicas.
4. **Los hooks escriben directamente desde el navegador.** `useOnboardingSteps.updateStep` actualiza `onboarding_steps` con el cliente público. El acceso debe permanecer denegado hasta que RLS y la autorización de servidor estén definidas y probadas.
5. **Las rutas `/dashboard` y `/clients/[id]` no están protegidas por autenticación de aplicación.** La protección SSO observada corresponde al Preview de Vercel, no sustituye la autorización de la aplicación.

**Decisión de seguridad:** no abrir políticas generales, no agregar `USING (true)`, no habilitar escritura con anon/publishable key y no exponer datos reales en Preview/Production antes de resolver estos puntos.

### P1 — Integridad del modelo de datos

El esquema define las tablas y las relaciones básicas, pero no formaliza varias reglas de dominio:

- `onboarding_steps.step_number`: comentario indica 1–20, pero no hay CHECK que lo garantice.
- `onboarding_steps.etapa`: comentario indica 1–4, pero no hay CHECK que lo garantice ni relación declarativa entre paso y etapa.
- `status` de clientes y pasos: los valores válidos están documentados en comentarios, no restringidos por CHECK o ENUM.
- `progress_percentage`, `adoption_score` y contadores de métricas no tienen límites/rangos declarados en base de datos.
- `adoption_metrics` permite más de una medición por cliente/fecha; debe decidirse si se requiere unicidad.
- `videos.step_number` no es único; debe definirse si puede haber versiones/idiomas múltiples por paso.
- `depends_on_step` es un entero sin FK a otro paso ni validación de rango/ciclo.
- `updated_at` tiene default, pero no hay trigger que lo actualice automáticamente al modificar filas.
- Las fechas usan `TIMESTAMP` sin zona horaria; debe definirse la convención temporal antes de integrar procesos externos.

No se agregaron constraints porque pueden rechazar datos existentes y requieren inspección de datos y aprobación de reglas.

### P1 — Propiedad y alcance de acceso

- `clients.assigned_onboarder_id` referencia `auth.users(id)`, pero no existe tabla de perfiles/roles ni asignación de permisos.
- `videos` no tiene propietario/tenant; el alcance de administración y lectura no está definido.
- `adoption_metrics` y `video_sends` dependen de `client_id`; sus políticas deben comprobar la propiedad del cliente relacionado, no solo el usuario autenticado.
- `clients.email` y `onboarding_steps.notes/blocker_reason` pueden contener información de clientes. Deben limitarse por tenant/rol y no aparecer en logs públicos.

## Matriz mínima de autorización a aprobar

| Recurso/acción | Pregunta de negocio pendiente | Control técnico requerido |
|---|---|---|
| Clientes: lectura | ¿Administrador global o onboarder asignado? | Server-side + RLS por asignación/tenant |
| Clientes: alta/edición/archivo | ¿Qué rol crea, modifica y archiva? | Handler server-side + política de escritura |
| Pasos: lectura | ¿El cliente final puede acceder o solo el equipo interno? | RLS mediante relación con cliente |
| Pasos: estado/notas/bloqueadores | ¿Qué roles editan cada campo? | Validación de campos y autorización por acción |
| Videos: CRUD | ¿Biblioteca global o por tenant? | Rol administrador y alcance definido |
| Métricas: ingestión | ¿Qué PMS es fuente de verdad y quién puede sincronizar? | Endpoint server-side autenticado, idempotencia y auditoría |
| Envíos: creación | ¿Qué canal, destinatario y aprobador? | Proceso server-side; nunca envío directo desde el navegador |

## Secuencia segura propuesta

1. Aprobar tenant/ownership y roles (administrador, onboarder y cualquier rol de solo lectura).
2. Definir si existe acceso de cliente final y qué información puede consultar.
3. Diseñar matriz de permisos por tabla y acción; mapearla a autorización server-side y políticas RLS.
4. Añadir login/logout y protección de rutas; usar `auth.getUser()` como verificación de identidad, no `getSession()` como decisión de autorización.
5. Preparar migraciones incrementales con constraints/índices/triggers solo después de inspeccionar la base real y sus datos.
6. Probar con usuarios de distintos roles, clientes asignados/no asignados y casos negativos (lectura, inserción, actualización y borrado).
7. Implementar alta idempotente de cliente y plantilla versionada de 20 pasos.
8. Recién entonces conectar PMS, métricas y comunicaciones con credenciales server-side, idempotencia y auditoría.

## Estado de aceptación

- [x] Esquema y código inspeccionados estáticamente.
- [x] P0 de autenticación/autorización documentados.
- [x] Reglas de integridad faltantes identificadas.
- [x] Matriz de decisiones y secuencia segura documentadas.
- [ ] Proyecto Supabase y base real disponibles para inspección.
- [ ] Modelo de roles/ownership aprobado.
- [ ] Migraciones seguras implementadas y probadas.
- [ ] Autenticación, autorización y RLS validadas con usuarios reales.

**Conclusión:** el código está preparado para una configuración Supabase segura en términos de no abrir acceso por defecto, pero no constituye todavía un backend autenticado y operativo. Mantener el PMV bloqueado para datos reales y no ejecutar `schema.sql` sobre una base existente.
