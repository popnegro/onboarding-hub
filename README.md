# Onboarding Hub - PXSOL

Herramienta interna para gestión centralizada de onboarding de clientes hoteleros en PXSOL.

## Funcionalidades

- **Checklist de 20 pasos**: guía estructurada en 4 etapas (Bienvenida, Configuración, Capacitación, Integraciones).
- **Monitor de adopción**: scoring y alertas de churn risk únicamente cuando existan métricas reales verificadas.
- **Biblioteca de videos**: catálogo de capacitación; los envíos requieren URLs reales y un canal configurado.
- **Dashboard de onboarders**: vista de clientes activos y progreso.

## Alcance y estado de integraciones

Este repositorio corresponde a una demo interna de PXSOL para presentación. No es un portal de acceso para clientes hoteleros. Los datos de presentación son ficticios.

HubSpot, PMS, email y WhatsApp **no están conectados**. No se activan comunicaciones ni integraciones externas. No considerar las métricas ficticias como datos de adopción reales.

## Requisitos previos

- Node.js 22.23+
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

Crear un proyecto Supabase y configurar las variables en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
# Alternativa legacy:
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

La clave `SUPABASE_SERVICE_ROLE_KEY` nunca debe exponerse al navegador ni utilizarse como variable `NEXT_PUBLIC_*`. No se necesita para compilar la aplicación.

### Clientes Supabase para Next.js

- `src/lib/supabase/client.ts`: cliente para componentes de navegador.
- `src/lib/supabase/server.ts`: cliente por request para Server Components y handlers.
- `src/lib/supabase.ts`: tipos de dominio compartidos.
- `src/middleware.ts`: refresca la sesión, propaga cookies y protege las rutas privadas.

El login/logout utiliza Supabase Auth con email y contraseña para cuentas internas provisionadas manualmente. El registro público debe permanecer deshabilitado.

### 3. Esquema y migraciones

La migración inicial versionada es:

`supabase/migrations/20261101050338_internal_demo_access.sql`

Crea las tablas `videos`, `clients`, `onboarding_steps`, `adoption_metrics` y `video_sends`, habilita RLS y configura acceso compartido para el rol `authenticated`. También inserta un cliente y 20 pasos ficticios.

**Estado del proyecto PXSOL:** esta migración ya fue aplicada y validada en el proyecto Supabase conectado. Su versión remota registrada es `20261101050338`. No volver a ejecutarla ni aplicar `schema.sql` sobre esa base.

Para una instalación nueva o una base distinta, primero auditar esquema, historial de migraciones y policies existentes. No aplicar una migración inicial sobre una base con objetos previos sin preparar una migración específica.

Las policies actuales son para una demo interna compartida, no implementan aislamiento multi-tenant. Mantener signup público deshabilitado y provisionar manualmente las cuentas autorizadas. Ver [docs/internal-demo-access.md](docs/internal-demo-access.md) y [docs/supabase-setup.md](docs/supabase-setup.md).

### 4. Ejecutar localmente

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Deployment en Vercel

Configurar en los entornos requeridos:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

La app conserva compatibilidad con `NEXT_PUBLIC_SUPABASE_ANON_KEY` legacy. Ambas variables deben pertenecer al mismo proyecto Supabase. No configurar claves ficticias ni secretos de servidor como variables públicas.

El proyecto Vercel mantiene Deployment Protection mediante Vercel Authentication (SSO). El acceso automatizado sin sesión autorizada no permite ejecutar smoke tests HTTP; no deshabilitar SSO para sortear esa restricción.

## Monitor y scoring de adopción

El score documentado utiliza estos pesos:

```
Score = (Reservas × 0.30) + (Usuarios × 0.20) + (Tarifas × 0.20)
      + (Reportes × 0.15) + (Integraciones × 0.15)
```

Categorías de adopción:
- Alto (70+): On Track.
- Medio (40-69): Atención.
- Bajo (<40): Crítico.

Estas categorías describen nivel de adopción, no nivel de riesgo. La UI debe indicar que no existen mediciones verificadas mientras no haya una fuente real conectada.

## Desarrollo y validación

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

El script `build` ejecuta tests, lint, typecheck y el build de Next.js.

## Pendiente antes de producción real

- Definir roles y aislamiento por tenant; las policies actuales son compartidas para demo interna.
- Diseñar creación idempotente de clientes y sus 20 pasos desde una plantilla aprobada.
- Cargar catálogo de videos con URLs reales verificadas.
- Integrar y validar una fuente PMS para métricas de adopción.
- Integrar HubSpot mediante webhook autenticado e idempotente.
- Implementar comunicaciones solo con proveedor, destinatario y consentimiento verificados.
- Incorporar logs, manejo de errores, deduplicación y límites de frecuencia.
- Completar QA autenticado y visual en el entorno protegido.
- Revisar los avisos de seguridad de Supabase y el plan contratado antes de producción.

## Soporte

Para dudas o bugs, crear un issue en GitHub.
