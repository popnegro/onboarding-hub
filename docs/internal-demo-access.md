# Acceso interno — demo PXSOL Onboarding Hub

## Alcance aprobado

Onboarding Hub es una herramienta interna de PXSOL que se presenta como demo en una postulación laboral. No es un portal para clientes hoteleros.

- Solo ingresan cuentas internas creadas o invitadas manualmente por el administrador.
- No se habilita registro público.
- Los usuarios autenticados del equipo comparten el alcance operativo del demo.
- Los registros de clientes, pasos y métricas utilizados en la presentación deben ser ficticios.
- No se conectan HubSpot, PMS, WhatsApp, email ni automatizaciones reales.

## Implementación de aplicación

- La ruta /login autentica mediante Supabase Auth con email y contraseña.
- /dashboard y /clients/* requieren una sesión válida.
- Middleware valida la identidad con auth.getUser() y falla cerrado si faltan variables de Supabase.
- El cierre de sesión invalida la sesión y vuelve a /login.
- No existe registro público ni recuperación de contraseña pública en esta demo.

## Configuración requerida en Supabase

1. Desactivar el registro público de usuarios (Allow new users to sign up).
2. Crear/invitar manualmente solo las cuentas internas que deban presentar o mantener el demo.
3. Configurar URLs de redirección de Auth para los dominios autorizados.
4. Revisar las políticas actuales de las cinco tablas antes de aplicar la migración.
5. Aplicar supabase/migrations/20261031_internal_demo_access.sql solo si la inspección confirma que no existen políticas previas que deban preservarse.

La migración concede CRUD a authenticated para las cinco tablas y revoca acceso anon. Solo es apropiada con registro público desactivado y cuentas internas provisionadas manualmente. No usar este modelo para un SaaS multi-tenant ni para un portal público.

## Límites del demo

- No ejecutar schema.sql sobre una base existente.
- No usar service-role keys en el navegador.
- No cargar datos personales o comerciales reales.
- No enviar comunicaciones ni activar workflows.
- No calcular churn con métricas ficticias: la UI debe mantener visible que el monitor requiere una fuente real verificada.

## Validación pendiente

- [ ] Confirmar Supabase Auth y registro público desactivado.
- [ ] Inspeccionar policies existentes y esquema real.
- [ ] Aplicar migración revisada en entorno demo.
- [ ] Crear cuenta interna de prueba.
- [ ] Probar acceso anónimo, login, logout, refresh y acceso directo a rutas protegidas.
- [ ] Probar lectura/escritura con cuenta autenticada y rechazo con rol anon.
- [ ] Cargar únicamente fixtures ficticios y marcarlos visualmente como datos demo.
