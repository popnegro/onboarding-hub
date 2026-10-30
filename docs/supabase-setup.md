# Supabase — provisión y habilitación segura

## Estado auditado

En la auditoría del 30/10/2026, Vercel mostraba registros de variables para Supabase en Preview y Production, pero sus valores estaban vacíos:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

No se obtuvo un Project URL ni una clave pública válida. El dashboard del Preview seguía mostrando el estado de configuración pendiente. La existencia del nombre de una variable no equivale a una credencial configurada.

## Variables requeridas por la aplicación

Configurar en Vercel, como mínimo, para Preview y Production según corresponda:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL del proyecto Supabase real |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key del proyecto; preferida |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Legacy anon key; alternativa compatible |

El código prefiere la publishable key actual y conserva compatibilidad con la legacy anon key. No configurar ambas con valores de proyectos diferentes.

No usar `service_role`, `secret key`, `SUPABASE_SECRET_KEY` ni `SUPABASE_SERVICE_ROLE_KEY` en variables públicas. La aplicación cliente no necesita una clave privilegiada.

## Secuencia de provisión

1. Crear o seleccionar el proyecto Supabase real de PXSOL.
2. Confirmar organización, región, proyecto y responsable operativo.
3. Copiar el Project URL y la Publishable key (o legacy anon key) desde el panel oficial del proyecto.
4. Cargar las variables requeridas en los entornos Vercel adecuados sin incluirlas en Git, logs o capturas.
5. Generar un nuevo deployment Preview del SHA candidato; las variables públicas se incorporan durante el build.
6. Verificar que el dashboard ya no muestre el aviso de configuración pendiente.
7. Antes de habilitar consultas reales, completar autenticación, autorización y políticas RLS.

## Seguridad de datos y autorización

El esquema actual habilita RLS en las cinco tablas y no crea políticas. Es un estado de denegación por defecto: evita exponer datos mediante la clave pública, pero también impide el uso normal de las tablas.

No agregar políticas `USING (true)` ni habilitar lecturas/escrituras globales para resolver errores.

Antes de definir políticas se debe aprobar el modelo funcional:

- ¿Existe un rol administrador global?
- ¿Qué usuarios pueden ver todos los clientes?
- ¿Los onboarders solo pueden ver clientes donde `assigned_onboarder_id = auth.uid()`?
- ¿Quién puede editar pasos, notas y bloqueadores?
- ¿Quién puede administrar videos y métricas?
- ¿Qué operaciones se reservan a procesos server-side?

El modelo debe aplicarse tanto en rutas/handlers de servidor como en RLS. Ocultar botones o proteger solo el frontend no constituye autorización.

## Migraciones

`schema.sql` es un esquema base para una instalación nueva. No ejecutarlo sobre una base existente sin inspeccionar primero tablas, columnas, constraints, índices, policies y datos. Preparar una migración incremental con respaldo y plan de reversión.

## Criterios para habilitar el PMV

- [ ] Proyecto Supabase identificado y accesible.
- [ ] URL y clave pública verificadas y presentes en Preview.
- [ ] Deployment Preview creado después de configurar variables.
- [ ] Login/logout implementado y probado con usuarios reales.
- [ ] Roles y propiedad de clientes aprobados.
- [ ] RLS probado con usuarios de distintos roles y clientes.
- [ ] Rutas y operaciones servidor-side autorizadas.
- [ ] Migraciones verificadas sobre el esquema real.
- [ ] Alta de cliente y creación idempotente de 20 pasos probadas.
- [ ] QA funcional y visual completado sin datos demo.

Hasta cumplir estos puntos, el backend permanece BLOCKED y el PMV no está validado.
