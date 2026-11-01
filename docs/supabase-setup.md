# Supabase — provisión y habilitación segura

## Alcance aprobado

Supabase se utilizará para una demo de herramienta interna PXSOL destinada a una postulación laboral. No existe acceso para clientes hoteleros ni modelo multi-tenant en este alcance.

- Solo cuentas internas creadas/invitadas manualmente.
- Registro público desactivado.
- Datos ficticios para la presentación.
- Integraciones y comunicaciones externas deshabilitadas.

## Variables de la aplicación

Configurar en Vercel Preview:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto PXSOL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key del mismo proyecto |

La app conserva compatibilidad con `NEXT_PUBLIC_SUPABASE_ANON_KEY` legacy. No combinar claves de proyectos distintos.

No configurar `service_role`, `SUPABASE_SECRET_KEY` ni `SUPABASE_SERVICE_ROLE_KEY` como variables públicas. No se necesita una clave privilegiada para el navegador.

## Configuración Auth requerida

1. Desactivar Allow new users to sign up / registro público.
2. Crear o invitar manualmente solo las cuentas internas autorizadas.
3. Configurar las URLs de redirección de Auth para el dominio Preview que se utilizará.
4. No activar proveedores OAuth adicionales si no se requieren para el demo.

La aplicación ya contiene login por email/contraseña, logout y protección de rutas en `src/middleware.ts`. Las rutas `/dashboard` y `/clients/*` requieren una sesión válida.

## Migración RLS

Archivo: `supabase/migrations/20261031_internal_demo_access.sql`.

La migración aborta si encuentra policies existentes en las tablas objetivo. Si no existen, habilita RLS, revoca acceso a `anon` y concede CRUD a `authenticated`.

La política es de acceso compartido entre usuarios autenticados; solo es aceptable para el demo interno con registro público desactivado y cuentas manuales. No usar en un SaaS multi-tenant.

**No ejecutar todavía:** primero inspeccionar el esquema, privilegios y policies reales. No ejecutar `schema.sql` sobre una base existente. No modificar datos reales.

## Secuencia de validación

1. Confirmar proyecto, organización y responsables.
2. Verificar variables Preview (URL y publishable key).
3. Desactivar registro público y provisionar una cuenta interna de prueba.
4. Inspeccionar tablas, grants y policies en las cinco tablas.
5. Revisar la migración y aplicarla solo si el estado real coincide con sus precondiciones.
6. Probar acceso anónimo rechazado, login válido, logout, refresh y acceso directo a rutas.
7. Probar lectura/escritura autenticada y rechazo con rol anon.
8. Usar únicamente fixtures ficticios y visibles como demo.

## Criterios de aceptación

- [x] Login/logout implementados en código.
- [x] Middleware de protección compilado en `src/middleware.ts`.
- [x] Rutas privadas redirigen a login en smoke test local sin Supabase.
- [ ] Variables Supabase Preview verificadas en el deployment final.
- [ ] Registro público desactivado.
- [ ] Cuenta interna provisionada.
- [ ] Policies reales inspeccionadas y migración validada.
- [ ] QA remoto autenticado y no autenticado completado.
- [ ] QA visual desktop/mobile completado.

Hasta cumplir los pendientes, el backend no debe considerarse operativo con datos reales.
