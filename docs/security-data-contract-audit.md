# Auditoría de contrato de datos y autorización — PXSOL Onboarding Hub

**Fecha:** 31/10/2026  
**Rama:** `fix/vercel-build-supabase-types`  
**Alcance:** demo interno para postulación laboral; no hay acceso de clientes hoteleros.

## Decisión de producto

Onboarding Hub es una herramienta de uso interno del equipo PXSOL que se presenta como demo. No requiere multi-tenancy, roles de clientes finales ni aislamiento por hotel. El acceso previsto es para cuentas internas creadas manualmente en Supabase Auth. Los datos de presentación deben ser ficticios.

## Estado P0 — Autenticación y acceso

### Implementado en código
- Login email/contraseña con Supabase Auth en `/login`.
- Logout en navegación desktop y mobile.
- Middleware ubicado en `src/middleware.ts`, junto al App Router.
- `auth.getUser()` valida identidad; `/dashboard` y `/clients/*` redirigen a login si no hay usuario.
- Fail-closed cuando faltan variables Supabase.
- Redirect post-login restringido a rutas internas.
- Smoke test local sin configuración Supabase: dashboard y ficha responden 307 a login; login responde 200.

### Pendiente de configuración y validación real
- Desactivar registro público en Supabase Auth.
- Crear/invitar manualmente las cuentas internas.
- Inspeccionar esquema y policies actuales del proyecto Supabase.
- Aplicar la migración interna solo después de verificar que no hay policies existentes.
- Probar login/logout, refresh y lecturas/escrituras con una cuenta interna real.
- Verificar en Preview el redirect anónimo con el middleware compilado.

### Migración RLS preparada, no ejecutada

Archivo: `supabase/migrations/20261031_internal_demo_access.sql`.

La migración:
- Aborta si detecta cualquier policy existente en las cinco tablas objetivo.
- Habilita RLS.
- Revoca privilegios de `anon`.
- Concede CRUD al rol `authenticated` y crea políticas para usuarios autenticados.

**Límite explícito:** todos los usuarios autenticados comparten permisos operativos sobre los datos del demo. Esto solo es aceptable si el alta pública está desactivada y las cuentas son provisionadas manualmente. No es un diseño multi-tenant ni un modelo de roles. No ejecutar sin inspeccionar la base real.

Los hooks actuales actualizan pasos desde el navegador. La seguridad de estas operaciones depende de que RLS esté correctamente aplicada; no habilitar consultas reales antes de la migración validada.

## P1 — Semántica del nivel de riesgo de adopción

La función `getRiskLevel` asignaba riesgo alto a scores >=70 y bajo a scores <40, invirtiendo el sentido de los rangos de adopción.

Corrección aplicada en `src/lib/adoption-scoring.ts`, `src/components/AdoptionMonitor.tsx` y tests:
- Score >=70 → riesgo `bajo`.
- Score 40–69 → riesgo `medio`.
- Score <40 o no finito → riesgo `alto`.
- Señales negativas o no finitas aportan 0; valores por encima del objetivo se limitan a 100.

Los pesos y umbrales no fueron validados con datos reales ni aprobados como reglas comerciales.

## P1 — Integridad del modelo de datos

El esquema base no formaliza:
- Rango 1–20 de `onboarding_steps.step_number`.
- Rango 1–4 de `onboarding_steps.etapa` ni relación declarativa entre paso y etapa.
- Valores permitidos de status mediante CHECK/ENUM.
- Rangos para `progress_percentage`, `adoption_score` y contadores.
- Unicidad de métricas por cliente/fecha.
- Unicidad/versionado de videos por número de paso.
- FK/rango/ciclos para `depends_on_step`.
- Trigger para mantener `updated_at`.
- Convención temporal explícita para timestamps con zona.

No agregar constraints sin inspeccionar datos existentes: pueden rechazar o alterar registros.

## P1 — Integraciones y datos

- HubSpot, PMS, WhatsApp, email y n8n permanecen fuera del alcance operativo del demo.
- No hay ingestión de métricas PMS verificada.
- No mostrar scores ficticios como indicadores reales de adopción/churn.
- No enviar comunicaciones ni activar workflows.
- No incluir datos personales o comerciales reales en fixtures, logs o capturas.

## Validación

- [x] Decisión de producto interna, sin acceso de clientes finales.
- [x] Login/logout y middleware implementados.
- [x] Middleware incluido en el manifest de build.
- [x] Tests 30/30, lint, TypeScript y build PASS en sandbox aislado.
- [x] Smoke test local de rutas privadas sin Supabase.
- [ ] Deployment Preview final READY y smoke test remoto.
- [ ] Registro público de Supabase Auth desactivado.
- [ ] Esquema y policies reales inspeccionados.
- [ ] Migración RLS aplicada y validada en entorno demo.
- [ ] Cuenta interna real probada.
- [ ] QA visual desktop/mobile.
- [ ] Fixtures ficticios identificados como demo.

**Conclusión:** el flujo de autenticación está implementado en código, pero el backend sigue BLOCKED hasta configurar Supabase Auth, inspeccionar policies y validar una cuenta interna real. No ejecutar `schema.sql` sobre una base existente ni aplicar la migración sin auditoría previa.
