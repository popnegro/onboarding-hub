# 🚀 DEPLOYMENT - Onboarding Hub a Vercel

Guía paso a paso para llevar el MVP a producción en 15 minutos.

## Paso 1: Setup Supabase (2 min)

### 1.1 Crear Proyecto Supabase

1. Ir a [supabase.com](https://supabase.com) → Click "Start your project"
2. Crear proyecto nuevo (o usar existente)
3. Esperar 2-3 minutos a que se inicialice

### 1.2 Obtener Credenciales

En el proyecto Supabase:
1. Ir a **Settings** → **API**
2. Copiar:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `Service role key` (abajo) → `SUPABASE_SERVICE_ROLE_KEY`

### 1.3 Crear Tablas

1. Ir a **SQL Editor** en Supabase
2. Click **"New query"**
3. Copiar y pegar contenido de `schema.sql`
4. Click **"Run"**
5. Esperar a que complete (debe crear todas las tablas)

## Paso 2: Preparar Código para Vercel (3 min)

### 2.1 Crear Repositorio GitHub

```bash
# En tu máquina local
cd onboarding-hub
git init
git add .
git commit -m "Initial commit: Onboarding Hub MVP"
git remote add origin https://github.com/TU_USUARIO/onboarding-hub.git
git branch -M main
git push -u origin main
```

O simplemente usa el repo ya inicializado si lo tienes.

### 2.2 Verificar .env.local NO está en Git

```bash
# Asegurarse que .gitignore tenga:
cat .gitignore | grep ".env.local"
# Debe mostrar: .env.local
```

## Paso 3: Deploy a Vercel (10 min)

### Opción A: Dashboard Vercel (Recomendado)

1. Ir a [vercel.com](https://vercel.com)
2. Login con GitHub
3. Click **"Add New..."** → **"Project"**
4. Seleccionar repo `onboarding-hub`
5. Click **"Import"**
6. En "Environment Variables", agregar:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIs...
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIs...
   ```
7. Click **"Deploy"**
8. Esperar ~3-5 min
9. Cuando diga "✓ Ready", tu URL estará en pantalla (ej: `onboarding-hub-tau.vercel.app`)

### Opción B: CLI Vercel (Alternativo)

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Seguir prompts:
# - "Set up and deploy?" → Y
# - "Which scope?" → Tu usuario/equipo
# - "Link to existing project?" → N
# - "Project name?" → onboarding-hub
# - "Which directory?" → ./
# - "Command for production builds?" → npm run build (enter)
# - "Install dependencies?" → Y

# Después, agregar env vars:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy final
vercel --prod
```

## Paso 4: Verificación (Extra)

### 4.1 Probar la App en Producción

```
https://onboarding-hub-XXXXX.vercel.app
```

1. Ir a `/dashboard` → Debe cargar lista de clientes (4 de muestra)
2. Click en cliente → Ver checklist y monitor de adopción
3. Cambiar estado de paso → Debe guardar sin error

### 4.2 Logs (si algo falla)

En Vercel dashboard:
1. Click en deployment
2. Ver **"Logs"** o **"Functions"** para debugging

## Paso 5: Configurar Dominio Personalizado (Opcional)

En Vercel dashboard → Proyecto → Settings → Domains

```
Agregar:
- onboarding-hub.pxsol.com (si lo tienes)
- onboarding.pxsol.com
```

## 🎯 Post-Deployment Checklist

- [ ] MVP está deployado y accesible
- [ ] Dashboard carga sin errores
- [ ] Puedo ver 4 clientes de muestra
- [ ] Puedo editar estado de paso
- [ ] Adoption Monitor muestra datos

## ⚠️ Troubleshooting

### Error: "Connection refused"

**Causa:** Env vars no están configuradas correctamente

**Solución:**
```bash
# Verificar en Vercel:
1. Settings → Environment Variables
2. Copiar exactamente desde Supabase (sin espacios)
3. Redeploy (click "Redeploy" en último deployment)
```

### Error: "Table does not exist"

**Causa:** `schema.sql` no se ejecutó en Supabase

**Solución:**
```bash
# En Supabase:
1. SQL Editor → New Query
2. Pegar schema.sql completo
3. Click "Run"
4. Esperar a que termine (sin errores)
```

### Datos de muestra no aparecen

**Causa:** Schema se creó pero insertions fallaron

**Solución:**
```bash
# En Supabase, ejecutar en SQL Editor:
INSERT INTO clients (name, email, current_etapa, status) VALUES
('Hotel Fierro Buenos Aires', 'contacto@fierro.com', 2, 'active'),
('Hotel Fierro Mendoza', 'contacto@fierromza.com', 3, 'active'),
('Fierro Patagonia', 'contacto@fierropatagon.com', 4, 'active'),
('Fierro Córdoba', 'contacto@fierrocba.com', 1, 'active');
```

## 📞 Tiempo Estimado

| Paso | Tiempo |
|------|--------|
| Setup Supabase | 2 min |
| GitHub + Código | 3 min |
| Deploy Vercel | 5-10 min |
| **Total** | **15 min** |

---

**Ahora tienes tu MVP en producción. 🎉**

Próximo paso: Agregar integraciones reales con HubSpot y PMS.
