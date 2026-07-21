# Onboarding Hub - PXSOL

Herramienta interna para gestión centralizada de onboarding de clientes hoteleros en PXSOL.

## 🎯 Funcionalidades

- **Checklist de 20 Pasos**: Guía estructurada en 4 etapas (Bienvenida, Configuración, Capacitación, Integraciones)
- **Monitor de Adopción**: Scoring automático con alertas de churn risk
- **Biblioteca de Videos**: Envío dinámico de videos de capacitación
- **Dashboard de Onboarders**: Vista de clientes activos con progreso en tiempo real
- **Datos Mockeados**: MVP listo para usar sin necesidad de integración con APIs reales (aún)

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta Supabase (gratuita)
- Vercel (para deployment)

## 🚀 Setup Local

### 1. Clonar y Instalar

```bash
git clone <repo>
cd onboarding-hub
npm install
```

### 2. Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Obtener `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Copiar `.env.local.example` a `.env.local` y llenar valores

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Crear Tablas en Supabase

1. Ir a SQL Editor en Supabase
2. Ejecutar el contenido de `schema.sql`

```sql
-- Ver schema.sql para queries completas
```

### 4. Ejecutar Localmente

```bash
npm run dev
```

Abrir `http://localhost:3000`

## 🌐 Deployment a Vercel

### Opción A: Desde CLI

```bash
npm install -g vercel
vercel
```

Seguir prompts para conectar GitHub y Supabase

### Opción B: Desde Vercel Dashboard

1. Ir a [vercel.com](https://vercel.com)
2. Conectar GitHub repo
3. Agregar variables de entorno (env vars)
4. Deploy automático en cada push

**Variables a Configurar en Vercel:**

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

## 📁 Estructura de Proyecto

```
src/
├── app/                       # Next.js app router
│   ├── layout.tsx
│   ├── page.tsx              # Landing page
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard de clientes
│   └── clients/[id]/
│       └── page.tsx          # Detalle de cliente
├── components/
│   ├── Header.tsx
│   ├── ClientCard.tsx
│   ├── StepEditor.tsx
│   └── AdoptionMonitor.tsx
└── lib/
    ├── supabase.ts           # Cliente Supabase + tipos
    └── adoption-scoring.ts   # Lógica de scoring
```

## 🎨 Branding

- **Colores PXSOL** (Tailwind config):
  - Primary: `#0066cc` (pxsol-blue)
  - Dark: `#1a202c` (pxsol-dark)
  - Light: `#f7f9fc` (pxsol-light)
  - Accent: `#00d4ff` (pxsol-accent)

- **Tipografía**: System fonts (San Francisco, Segoe UI, Roboto)

- **Componentes**: shadcn/ui inspired (custom build)

## 🔄 Datos Mockeados

Por ahora, los datos de adopción son **simulados**. En producción:

1. **Conectar API de uso del PMS**: Reemplazar mock data con llamadas reales
2. **Sincronizar HubSpot**: Setup webhooks bidireccionales (hacer en Make.com)
3. **Email/WhatsApp**: Configurar SendGrid + Twilio

Ver `src/lib/adoption-scoring.ts` para entender cómo se calculan scores.

## 📊 Métricas Clave

### Adoption Score (0-100)

```
Score = (Reservas × 0.30) + (Usuarios × 0.20) + (Tarifas × 0.20) + (Reportes × 0.15) + (Integraciones × 0.15)
```

**Categorías de Riesgo:**
- 🟢 Alto (70+): On Track
- 🟡 Medio (40-69): Atención
- 🔴 Bajo (<40): Crítico

## 🛠️ Desarrollo

### Agregar Nueva Página

```bash
# src/app/nueva-pagina/page.tsx
export default function NuevaPagina() {
  return <div>Contenido</div>
}
```

### Agregar Componente

```bash
# src/components/MiComponente.tsx
'use client'
export default function MiComponente() {
  return <div>Componente</div>
}
```

### Queries a Supabase

```typescript
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('clients')
  .select('*')
  .eq('status', 'active')
```

## 🚀 Próximos Pasos (Post-MVP)

- [ ] Integración HubSpot (webhooks bidireccionales)
- [ ] ETL de datos de uso del PMS
- [ ] Automatización de alertas vía email/WhatsApp
- [ ] Portal para clientes (auto-servicio)
- [ ] Analytics avanzado
- [ ] Roles y permisos por onboarder
- [ ] Export de reportes (PDF)

## 📞 Soporte

Para dudas o bugs:
1. Crear issue en GitHub
2. Contactar al equipo de dev

## 📄 Licencia

© 2025 PXSOL - Todos los derechos reservados
