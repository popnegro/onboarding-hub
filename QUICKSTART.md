# ⚡ Quick Start - 5 Minutos

## En Local

```bash
# 1. Clonar y instalar
git clone <repo>
cd onboarding-hub
npm install

# 2. Configurar .env.local
cp .env.example .env.local
# Editar con tus credenciales Supabase

# 3. Crear BD en Supabase
# SQL Editor → Pegar schema.sql → Run

# 4. Correr app
npm run dev

# 5. Abrir en navegador
# http://localhost:3000/dashboard
```

## Deploy a Vercel (15 min)

```bash
# 1. Push a GitHub
git push origin main

# 2. Ir a vercel.com → Conectar repo

# 3. Agregar env vars:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY

# 4. Deploy

# 5. ✅ Ready!
# https://onboarding-hub-XXXXX.vercel.app/dashboard
```

## URLs Importantes

- Landing: `/`
- Dashboard: `/dashboard`
- Cliente: `/clients/[id]`

## Datos de Prueba

4 clientes incluidos en `schema.sql`:
1. Hotel Fierro Buenos Aires (Etapa 2)
2. Hotel Fierro Mendoza (Etapa 3)
3. Fierro Patagonia (Etapa 4)
4. Fierro Córdoba (Etapa 1)

## Próximos Pasos

Ver `DEPLOYMENT.md` para deployment detallado.
Ver `README.md` para arquitectura y desarrollo.
