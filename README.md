# Onboarding Hub - PXSOL

Herramienta interna para gestión centralizada de onboarding de clientes hoteleros en PXSOL.

## Funcionalidades previstas

- **Checklist de 20 pasos**: guía estructurada en 4 etapas (Bienvenida, Configuración, Capacitación, Integraciones).
- **Monitor de adopción**: scoring y alertas de churn risk cuando existan métricas reales verificadas.
- **Biblioteca de videos**: catálogo de capacitación; los envíos requieren URLs reales y un canal configurado.
- **Dashboard de onboarders**: vista de clientes activos y progreso.

## Estado de integraciones

El repositorio contiene la estructura inicial del MVP. HubSpot, PMS, email y WhatsApp no deben considerarse conectados hasta que sus credenciales, endpoints y pruebas estén configurados.

El repositorio se presenta como demo de uso interno para una postulación laboral. No es un portal para clientes hoteleros. Los datos de presentación deben ser ficticios y no se activan comunicaciones ni integraciones externas.

## Requisitos previos

- Node.js 22.23+ (verificado también con Node 26.0.0)
- npm 10+
- Proyecto Supabase
- Proyecto Vercel

## Setup local

### 1. Instalar

```bash
git clone <repo>
cd onboarding-hub
npm ci
```

### 2. Configurar Supabase

Crear un proyecto en [Supabase](https://supabase.com) y configurar las variables en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
# Alternativa legacy si el proyecto todavía usa anon keys:
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

La clave `SUPABASE_SERVICE_ROLE_KEY` nunca debe exponerse al navegador ni utilizarse como variable `NEXT_PUBLIC_*`. No se necesita para compilar la aplicación.

### Clientes Supabase para Next.js

El SDK `@supabase/supabase-js` y el adaptador `@supabase/ssr` ya están incluidos en las dependencias. Se eliminó el paquete obsoleto `@supabase/auth-helpers-nextjs`. El proyecto dispone de:

- `src/lib/supabase/client.ts`: cliente para componentes de navegador, con sesión basada en cookies.
- `src/lib/supabase/server.ts`: cliente por request para Server Components y handlers que puedan acceder a cookies.
- `src/lib/supabase.ts`: tipos de dominio compartidos; no crea clientes ni conserva sesiones.
- `middleware.ts`: refresca la sesión de Supabase Auth y propaga cookies cuando las credenciales están configuradas; sin credenciales deja pasar la request para que la app muestre su estado de configuración pendiente.

Usá el helper de navegador desde componentes con `'use client'` y el helper de servidor desde módulos server-only. No importes el cliente de servidor en componentes cliente. El middleware ya refresca las sesiones y propaga cookies cuando Supabase está configurado. El login/logout y la protección de rutas se implementan para cuentas internas provisionadas manualmente. No hay registro público. La configuración de Supabase Auth y la migración RLS interna se documentan en docs/internal-demo-access.md.

### 3. Crear las tablas

Ejecutar `schema.sql` desde el SQL Editor de Supabase en una instalación nueva.

**Importante:**
- El esquema crea las tablas en orden de dependencias y no inserta registros demo.
- `onboarding_steps` tiene unicidad por cliente y número de paso.
- RLS está habilitado y no se agregan políticas permisivas por defecto. Sin políticas explícitas, las consultas con la clave anon serán denegadas.
- Para la demo interna, revisar las policies existentes y aplicar la migración supabase/migrations/20261031_internal_demo_access.sql solo después de verificar el estado real de la base.
- Si ya existe una base de datos, revisar y preparar una migración específica antes de ejecutar cambios; `schema.sql` no sustituye una migración de actualización.

### 4. Ejecutar localmente

```bash
npm run dev
```

Abrir `http://localhost:3000`.

La aplicación acepta la Publishable key actual o, como alternativa, la legacy anon key. El valor de ambas debe pertenecer al mismo proyecto Supabase. Ver [docs/supabase-setup.md](docs/supabase-setup.md) para provisión, autorización y validación segura.

## Deployment en Vercel

Configurar las siguientes variables en los entornos que correspondan:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (preferida) o NEXT_PUBLIC_SUPABASE_ANON_KEY (legacy)
```

No configurar claves ficticias. La aplicación permite compilar sin las variables, pero las consultas a Supabase mostrarán un error explícito hasta completar la configuración.

## Estructura

```
src/
├── app/
│   ├── dashboard/
│   └── clients/[id]/
├── components/
└── lib/
    ├── supabase.ts
    └── adoption-scoring.ts
schema.sql
```

## Monitor y scoring de adopción

El score documentado utiliza estos pesos:

```
Score = (Reservas × 0.30) + (Usuarios × 0.20) + (Tarifas × 0.20)
      + (Reportes × 0.15) + (Integraciones × 0.15)
```

Categorías de adopción documentadas:
- Alto (70+): On Track.
- Medio (40-69): Atención.
- Bajo (<40): Crítico.

Estas categorías describen nivel de adopción, no nivel de riesgo. El monitor no debe mostrar métricas hasta que exista una fuente real verificada. Actualmente la UI indica explícitamente que no hay mediciones verificadas.

## Desarrollo

```bash
npm run dev
npm run lint
npm run build
```

## Pendiente para presentar el demo\n\n- Desactivar el registro público de Supabase Auth y provisionar manualmente cuentas internas.\n- Aplicar y probar la migración RLS interna después de auditar policies existentes.\n- Incorporar fixtures ficticios identificados como demo y validar la experiencia visual.\n\n## Pendiente antes de producción

- Definir autenticación, roles y políticas RLS.
- Implementar creación de clientes y generación idempotente de sus 20 pasos a partir de una plantilla aprobada.
- Cargar catálogo de videos con URLs reales verificadas.
- Integrar y validar fuente PMS para métricas de adopción.
- Implementar HubSpot mediante webhook autenticado e idempotente.
- Implementar envío de capacitación con proveedor, destinatario y registro de envío verificados.
- Incorporar logs, manejo de errores, deduplicación y límites de frecuencia en automatizaciones.
- Validar el flujo completo en Preview antes de producción.

## Soporte

Para dudas o bugs, crear un issue en GitHub.
