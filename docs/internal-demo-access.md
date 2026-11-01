# Acceso interno — demo PXSOL Onboarding Hub

## Alcance aprobado

Onboarding Hub es una herramienta interna de PXSOL para una demo de presentación. No es un portal de clientes hoteleros ni un SaaS multi-tenant.

- Solo ingresan cuentas internas creadas o invitadas manualmente.
- El registro público de Supabase Auth permanece deshabilitado.
- Los usuarios autenticados comparten el alcance operativo de esta demo.
- Los datos de presentación son ficticios.
- HubSpot, PMS, WhatsApp, email y automatizaciones externas no están conectados ni habilitados.

## Autenticación y rutas

- `/login` autentica mediante Supabase Auth con email y contraseña.
- `/dashboard` y `/clients/*` requieren una sesión válida.
- `src/middleware.ts` valida la identidad con `auth.getUser()`, refresca cookies y redirige al login si no hay sesión.
- Si faltan las variables públicas de Supabase, las rutas privadas permanecen bloqueadas.
- El cierre de sesión invalida la sesión y vuelve a `/login`.
- No hay registro público.

La protección Vercel Authentication (SSO) es una capa adicional de acceso al deployment; no sustituye Supabase Auth.

## Estado Supabase verificado — 01/11/2026

Proyecto: `paycbzwufbviyplxjooc`.

Migración aplicada: `20261101050338_internal_demo_access`.

Tablas creadas y con RLS habilitado:
- `videos`
- `clients`
- `onboarding_steps`
- `adoption_metrics`
- `video_sends`

Policies `internal_authenticated_all_*`: CRUD para `authenticated`, condicionado a `auth.uid() IS NOT NULL`. El rol `anon` no tiene SELECT en esas tablas. La política es compartida entre usuarios autenticados y **no proporciona aislamiento por usuario o tenant**.

La migración insertó un único cliente ficticio (`HOTEL DEMO PXSOL — DATOS FICTICIOS`, `demo@pxsol.invalid`) y sus 20 pasos en estado `not_started`. No contiene huéspedes, reservas ni métricas reales.

No volver a ejecutar esta migración sobre el proyecto conectado. No ejecutar `schema.sql` sobre una base existente.

## Controles operativos

- Mantener signup público deshabilitado.
- Provisionar manualmente las cuentas internas autorizadas.
- No usar service-role keys en el navegador.
- No cargar datos personales o comerciales reales.
- No enviar comunicaciones ni activar workflows.
- No presentar métricas ficticias como adopción real.
- No convertir este modelo RLS compartido en una solución multi-tenant sin un diseño y una migración específicos.

## Validación

- [x] Login/logout con cuenta QA confirmados manualmente por el usuario.
- [x] Signup público deshabilitado, confirmado manualmente.
- [x] Middleware y redirección de rutas privadas implementados.
- [x] Migración aplicada y versión remota sincronizada.
- [x] RLS habilitado en las cinco tablas.
- [x] Acceso anon rechazado por las policies y permisos revisados.
- [x] Fixture ficticio y 20 pasos creados.
- [x] CI, lint, typecheck y build validados en el pipeline.
- [x] Deployment de `main` en Vercel en estado `READY`.
- [ ] Smoke test HTTP posterior al último merge desde una sesión Vercel autorizada.
- [ ] QA visual autenticado posterior al último merge.

## Limitaciones conocidas

- Leaked Password Protection permanece deshabilitada por una limitación del plan Supabase actual; no realizar upgrade ni workaround sin autorización.
- El acceso automatizado al deployment protegido por SSO no permite completar el smoke test HTTP. No deshabilitar SSO para sortearlo.
- La demo no debe considerarse lista para operación hotelera real ni para producción multi-tenant.
