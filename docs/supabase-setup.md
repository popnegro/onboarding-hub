# Supabase — provisión y habilitación segura

## Alcance

Supabase se utiliza para una demo de herramienta interna PXSOL destinada a una postulación laboral. No existe acceso para clientes hoteleros ni modelo multi-tenant.

- Solo cuentas internas creadas/invitadas manualmente.
- Signup público deshabilitado: **PASS manual confirmado por el usuario el 01/11/2026**.
- Login/logout real con cuenta QA: **PASS manual confirmado por el usuario**.
- Datos ficticios para presentación.
- Integraciones y comunicaciones externas deshabilitadas.

## Variables de la aplicación

Configurar en Vercel Preview:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto PXSOL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key del mismo proyecto |

La app conserva compatibilidad con `NEXT_PUBLIC_SUPABASE_ANON_KEY` legacy. No combinar claves de proyectos distintos.

No configurar `service_role`, `SUPABASE_SECRET_KEY` ni `SUPABASE_SERVICE_ROLE_KEY` como variables públicas. Las variables de integración existentes no se descifraron ni modificaron.

## Estado Auth

- Signup público: confirmado manualmente deshabilitado.
- Cuenta QA: creada y validada manualmente.
- Login/logout: PASS manual.
- Proveedores email/password habilitados; no se requieren OAuth adicionales.
- Pendiente: activar Leaked Password Protection. Supabase Security Advisor mantiene un WARN por esta función deshabilitada.
- Pendiente: QA visual desktop/mobile en Preview, actualmente protegido por Vercel SSO.

## Estado de base de datos

Auditoría de solo lectura del 01/11/2026:
- 0 tablas en `public`.
- 0 migraciones registradas.
- No hay datos de clientes ni policies RLS activas en tablas de aplicación.

La migración candidata `supabase/migrations/20261031_internal_demo_access.sql` crea las cinco tablas de aplicación, índices, RLS y policies de acceso interno:
- `videos`
- `clients`
- `onboarding_steps`
- `adoption_metrics`
- `video_sends`

Las policies conceden acceso compartido a usuarios autenticados; solo son válidas para esta demo interna con signup deshabilitado y cuentas provisionadas manualmente. No son multi-tenant. La migración agrega un único cliente ficticio (`HOTEL DEMO PXSOL — DATOS FICTICIOS`, `demo@pxsol.invalid`) y sus 20 pasos editoriales en estado `not_started`; no agrega métricas ni datos reales de huéspedes, reservas, PMS o HubSpot. El seed es idempotente.

**La migración no fue ejecutada.** No aplicar DDL al proyecto compartido sin HUMAN GATE. Primero probar la migración en un entorno aislado, revisar el resultado y validar el acceso anon/authenticated.

## Criterios de aceptación

- [x] Login/logout implementados en código y validados manualmente.
- [x] Middleware de protección compilado en `src/middleware.ts`.
- [x] Rutas privadas redirigen a login sin sesión.
- [x] Variables públicas Supabase Preview presentes en deployment auditado.
- [x] Signup público deshabilitado (confirmación manual).
- [x] Cuenta interna de QA provisionada.
- [x] CI: 32/32 tests, lint, typecheck y Next.js build PASS.
- [x] Vercel Preview READY para el HEAD candidato.
- [ ] QA HTTP autenticado y visual desktop/mobile.
- [ ] Leaked Password Protection habilitada.
- [ ] Migración inicial aplicada y validada en entorno de prueba.
- [ ] RLS: acceso anon rechazado y acceso authenticated validado.
- [ ] HUMAN GATE antes de DDL sobre el proyecto Supabase compartido.

Hasta completar los pendientes, el flujo de autenticación está operativo, pero el backend de datos no debe considerarse operativo con datos reales.
