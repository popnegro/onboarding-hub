# Onboarding Hub - PXSOL

Herramienta interna para gestión centralizada de onboarding de clientes hoteleros en PXSOL.

## Funcionalidades previstas

- **Checklist de 20 pasos**: guía estructurada en 4 etapas (Bienvenida, Configuración, Capacitación, Integraciones).
- **Monitor de adopción**: scoring y alertas de churn risk cuando existan métricas reales verificadas.
- **Biblioteca de videos**: catálogo de capacitación; los envíos requieren URLs reales y un canal configurado.
- **Dashboard de onboarders**: vista de clientes activos y progreso.

## Estado de integraciones

El repositorio contiene la estructura inicial del MVP. HubSpot, PMS, email y WhatsApp no deben considerarse conectados hasta que sus credenciales, endpoints y pruebas estén configurados.

Los datos de demostración y las URLs de ejemplo no son datos productivos. El esquema base no inserta clientes, videos ni métricas ficticias. No activar comunicaciones ni alertas sobre datos de demostración.

## Requisitos previos

- Node.js 18+
- npm
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
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

La clave `SUPABASE_SERVICE_ROLE_KEY` nunca debe exponerse al navegador ni utilizarse como variable `NEXT_PUBLIC_*`. No se necesita para compilar la aplicación.

### Clientes Supabase para Next.js

El SDK `@supabase/supabase-js` y el adaptador `@supabase/ssr` ya están incluidos en las dependencias. El proyecto dispone de:

- `src/lib/supabase/client.ts`: cliente para componentes de navegador, con sesión basada en cookies.
- `src/lib/supabase/server.ts`: cliente por request para Server Components y handlers que puedan acceder a cookies.
- `src/lib/supabase.ts`: cliente de compatibilidad utilizado por las pantallas actuales del MVP.
- `middleware.ts`: refresca la sesión de Supabase Auth y propaga cookies cuando las credenciales están configuradas; sin credenciales deja pasar la request para que la app muestre su estado de configuración pendiente.

Usá el helper de navegador desde componentes con `'use client'` y el helper de servidor desde módulos server-only. No importes el cliente de servidor en componentes cliente. El middleware ya refresca las sesiones y propaga cookies cuando Supabase está configurado. El flujo de login/logout, la protección de rutas y el modelo de roles/políticas RLS siguen pendientes.

### 3. Crear las tablas

Ejecutar `schema.sql` desde el SQL Editor de Supabase en una instalación nueva.

**Importante:**
- El esquema crea las tablas en orden de dependencias y no inserta registros demo.
- `onboarding_steps` tiene unicidad por cliente y número de paso.
- RLS está habilitado y no se agregan políticas permisivas por defecto. Sin políticas explícitas, las consultas con la clave anon serán denegadas.
- Antes de habilitar usuarios, definir y probar políticas RLS acordes al modelo de autenticación y roles.
- Si ya existe una base de datos, revisar y preparar una migración específica antes de ejecutar cambios; `schema.sql` no sustituye una migración de actualización.

### 4. Ejecutar localmente

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Deployment en Vercel

Configurar las siguientes variables en los entornos que correspondan:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
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

## Pendiente antes de producción

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
