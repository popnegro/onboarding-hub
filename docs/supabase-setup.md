# Supabase — provisión y estado verificado

## Alcance

Supabase se utiliza para la demo interna PXSOL Onboarding Hub. No existe acceso para clientes hoteleros ni aislamiento multi-tenant.

- Solo cuentas internas provisionadas manualmente.
- Signup público deshabilitado, confirmado manualmente por el usuario el 01/11/2026.
- Login/logout real con cuenta QA, confirmado manualmente.
- Datos ficticios.
- Integraciones y comunicaciones externas deshabilitadas.

## Proyecto conectado

- Project ref: `paycbzwufbviyplxjooc`
- URL: `https://paycbzwufbviyplxjooc.supabase.co`
- PostgreSQL 17.11
- Estado observado: `ACTIVE_HEALTHY`

## Variables de la aplicación

Configurar en Vercel los entornos requeridos:

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto PXSOL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key del mismo proyecto |

La app conserva compatibilidad con `NEXT_PUBLIC_SUPABASE_ANON_KEY` legacy. No combinar claves de proyectos distintos.

No configurar `service_role`, `SUPABASE_SECRET_KEY` ni `SUPABASE_SERVICE_ROLE_KEY` como variables públicas. No incluir secretos en documentación ni en el repositorio.

## Estado Auth

- Signup público: deshabilitado, confirmación manual.
- Cuenta QA: creada y validada manualmente.
- Login/logout: PASS manual.
- Proveedor email/password: habilitado.
- No se requieren proveedores OAuth para el flujo actual.

## Migración y esquema

Migración aplicada y validada:

`supabase/migrations/20261101050338_internal_demo_access.sql`

Versión remota registrada: `20261101050338`.

Tablas en `public`:
- `videos`
- `clients`
- `onboarding_steps`
- `adoption_metrics`
- `video_sends`

RLS está habilitado en las cinco tablas. Las policies `internal_authenticated_all_*` permiten operaciones CRUD al rol `authenticated` con condición `auth.uid() IS NOT NULL`. El rol `anon` no tiene SELECT. No se habilitó FORCE ROW LEVEL SECURITY.

El modelo de policies es deliberadamente compartido para la demo interna: no separa usuarios ni tenants. No usarlo para un portal público o SaaS multi-tenant.

La migración creó un único cliente ficticio (`HOTEL DEMO PXSOL — DATOS FICTICIOS`, `demo@pxsol.invalid`) y 20 pasos `not_started`. No se insertaron huéspedes, reservas, datos PMS/HubSpot ni métricas reales.

**No volver a aplicar la migración ni ejecutar `schema.sql` sobre el proyecto conectado.** El archivo de migración está versionado para reflejar la versión remota ya aplicada.

## Seguridad y limitaciones conocidas

- Leaked Password Protection: no habilitada porque requiere Supabase Pro en el plan actual. Se acepta como limitación de esta demo interna; no realizar upgrade ni workaround sin autorización.
- Performance Advisor: recomienda índices adicionales en `onboarding_steps.video_id` y `video_sends.video_id`, y optimizar la expresión de `auth.uid()`. No son bloqueantes para el volumen ficticio actual; revisar antes de producción.
- No se utiliza ni se necesita una service-role key en el cliente.
- Mantener el signup público deshabilitado y provisionar cuentas manualmente.

## Criterios de aceptación y estado

- [x] Login/logout implementados y validados manualmente.
- [x] Middleware de protección de rutas.
- [x] Signup público deshabilitado.
- [x] Cuenta interna QA provisionada.
- [x] Migración aplicada y sincronizada con el historial remoto.
- [x] Cinco tablas creadas con RLS.
- [x] Acceso anon rechazado y policies autenticadas verificadas.
- [x] Fixture ficticio y 20 pasos insertados.
- [x] CI, lint, typecheck y build PASS.
- [x] Deployment asociado a `main` en estado `READY`.
- [ ] Smoke test HTTP post-merge desde una sesión Vercel autorizada.
- [ ] QA visual autenticado posterior al último merge.

El proyecto está validado como demo interna. No declarar habilitado para operación real hasta diseñar roles/tenancy, conectar fuentes reales y completar QA operativo.
