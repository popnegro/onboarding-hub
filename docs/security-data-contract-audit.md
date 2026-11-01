# Auditoría de contrato de datos y autorización — PXSOL Onboarding Hub

**Fecha de actualización:** 01/11/2026  
**Rama:** `fix/vercel-build-supabase-types`  
**Alcance:** demo de herramienta interna para postulación laboral; sin acceso de clientes hoteleros. Los datos de presentación deben ser ficticios.

## Decisión de producto

- Solo cuentas internas provisionadas manualmente en Supabase Auth.
- Signup público deshabilitado: **PASS manual confirmado por el usuario el 01/11/2026**.
- Login/logout reales con la cuenta QA: **PASS manual confirmado por el usuario el 01/11/2026**.
- No es un SaaS multi-tenant y no admite usuarios hoteleros.
- HubSpot, PMS, WhatsApp, email y n8n permanecen desconectados; no se envían comunicaciones ni se activan workflows.

## Estado de autenticación y rutas

### Implementado y validado
- Login email/contraseña en `/login`.
- Logout desktop y mobile.
- Middleware en `src/middleware.ts` con validación server-side mediante `auth.getUser()`.
- `/dashboard` y `/clients/*` redirigen a login sin sesión.
- Fail-closed si faltan variables Supabase.
- Redirect post-login restringido a rutas internas.
- Tests automatizados de redirect y smoke test local.
- El usuario confirmó prueba real de login y logout.
- El usuario confirmó que el signup público está deshabilitado. No se obtuvo una lectura automatizada independiente del ajuste `disable_signup`.

### Pendientes de configuración y validación
- QA visual desktop/mobile en Preview; el deployment requiere Vercel SSO. No se creó un bypass ni se alteró Deployment Protection.
- Activar Leaked Password Protection en Supabase Auth. Security Advisor reporta `auth_leaked_password_protection` como WARN.
- Repetir comprobación independiente de `disable_signup` cuando exista acceso soportado a Auth settings; no hay herramienta MCP de configuración Auth disponible.

## Estado real de base de datos (01/11/2026)

Auditoría de solo lectura del proyecto `paycbzwufbviyplxjooc`:
- Tablas en schema `public`: **0**.
- Migraciones registradas: **0**.
- Policies RLS: no hay tablas públicas sobre las que definir policies.
- Security Advisor: 1 warning por Leaked Password Protection deshabilitada.
- Performance Advisor: 0 findings.

**Conclusión:** autenticación funciona, pero el esquema de datos todavía no está desplegado. No presentar el backend de clientes/onboarding como operativo.

## Migración candidata

`supabase/migrations/20261031_internal_demo_access.sql` ahora contiene la creación inicial de las cinco tablas, índices, RLS, revocación de `anon`, permisos CRUD para `authenticated` y policies internas.

Tablas: `videos`, `clients`, `onboarding_steps`, `adoption_metrics`, `video_sends`. La migración también inserta un cliente sintético `HOTEL DEMO PXSOL — DATOS FICTICIOS` con correo reservado `demo@pxsol.invalid` y los 20 títulos del catálogo editorial. Los pasos quedan `not_started`; no se insertan métricas, huéspedes, reservas, videos grabados ni identificadores reales de HubSpot/PMS. La inserción usa UUID fijo y `ON CONFLICT DO NOTHING` para ser idempotente.

La policy concede acceso compartido a cualquier cuenta autenticada. Solo es aceptable para esta demo interna porque el signup está deshabilitado y las cuentas se provisionan manualmente. No es un diseño multi-tenant ni un modelo de roles.

**No se aplicó la migración al proyecto Supabase.** La base real sigue vacía. Aplicarla es un cambio de esquema en el backend conectado y requiere validación humana antes de ejecutar. La migración debe revisarse y probarse en un entorno no productivo antes de aplicarla al proyecto compartido.

## Riesgos y límites pendientes

- El esquema no formaliza todos los rangos y enumeraciones de negocio (pasos 1–20, etapas 1–4, status, métricas, scores).
- No hay trigger para mantener `updated_at`.
- No existe validación de `depends_on_step` ni detección de ciclos.
- Los pesos y umbrales de adoption scoring no se validaron con datos reales ni se aprobaron como reglas comerciales.
- No hay ingestión PMS verificada; no presentar scores ficticios como métricas reales.
- Las variables Vercel `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_SECRET_KEY` aparecieron en el inventario de integración; no se descifraron, usaron ni modificaron. El código de aplicación revisado no las referencia.

## Validación consolidada

- [x] Tests automatizados 30/30 en HEAD de código auditado previamente.
- [x] Lint, TypeScript y build PASS en HEAD de código auditado previamente.
- [x] Deployment Preview READY para HEAD `2379d24d50fa8d4bce6ccf53789e80aed3957859`.
- [x] Login/logout real PASS (confirmación manual del usuario).
- [x] Signup público deshabilitado PASS (confirmación manual del usuario).
- [x] Rutas privadas protegidas sin sesión.
- [ ] Repetir tests/build en el nuevo commit de migración y verificar el seed ficticio.
- [ ] QA visual desktop/mobile.
- [ ] Leaked Password Protection habilitada.
- [ ] Migración aplicada en entorno de prueba y pruebas RLS anon/authenticated.
- [ ] HUMAN GATE antes de aplicar DDL al proyecto Supabase compartido.
- [ ] Verificar lecturas/escrituras reales con cuenta interna después de la migración.

**Estado:** aplicación web y autenticación validadas; backend de datos bloqueado hasta revisar/aprobar y aplicar la migración inicial.
