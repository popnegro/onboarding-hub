# ✅ DEPLOYMENT CHECKLIST - Onboarding Hub

**Versión:** 1.0  
**Tiempo estimado:** 35 minutos  
**Dificultad:** Fácil  

---

## 🎯 PRE-DEPLOYMENT (5 min)

### 1. Descarga y Preparación

- [ ] Descargar `onboarding-hub.tar.gz`
- [ ] Descomprimir: `tar -xzf onboarding-hub.tar.gz`
- [ ] Abrir carpeta en editor (VS Code, etc)
- [ ] Abrir terminal en la carpeta

### 2. Verificar Requisitos

- [ ] Node.js 18+ instalado: `node --version` (debe ser v18.x o v20.x)
- [ ] npm instalado: `npm --version` (debe ser 9+)
- [ ] Git instalado: `git --version` (para push a GitHub)

---

## 📋 FASE 1: SUPABASE SETUP (10 min)

### 1. Crear Proyecto

- [ ] Ir a [supabase.com](https://supabase.com)
- [ ] Click "Start Your Project"
- [ ] Crear nuevo proyecto
- [ ] **Nombre:** `pxsol-onboarding-hub`
- [ ] **Region:** South America (São Paulo) o más cercana
- [ ] Guardar password de base de datos
- [ ] ⏳ Esperar 3-5 minutos a que se inicialice

### 2. Obtener Credenciales

- [ ] Ir a **Settings** → **API**
- [ ] Copiar **Project URL**
  ```
  https://xxxxxxxxxxxx.supabase.co
  ```
- [ ] Copiar **anon public key** (empieza con eyJ...)
- [ ] Scroll down, copiar **service_role key**
- [ ] ✏️ Guardar las 3 en un documento de texto (las usarás luego)

### 3. Crear Tablas

- [ ] En Supabase, ir a **SQL Editor**
- [ ] Click **"New Query"**
- [ ] Abrir archivo `schema.sql` (del proyecto descargado)
- [ ] **Copiar TODO el contenido**
- [ ] **Pegar en SQL Editor de Supabase**
- [ ] Click **"Run"** (botón azul arriba)
- [ ] ✅ Debe decir "Query successful"
- [ ] Ir a **Table Editor**, verificar tablas creadas:
  - [ ] `clients` (debe tener 4 registros)
  - [ ] `onboarding_steps` (debe tener ~80)
  - [ ] `videos` (debe tener 20)
  - [ ] `adoption_metrics` (debe tener 4)

---

## 🔧 FASE 2: PREPARAR CÓDIGO LOCAL (5 min)

### 1. Instalar Dependencias

```bash
npm install
```

- [ ] Esperar a que termine (2-3 min)
- [ ] Debe decir "added X packages"

### 2. Configurar Variables Locales (Opcional)

- [ ] Copiar `.env.example` → `.env.local`
- [ ] Abrir `.env.local` con editor
- [ ] Reemplazar valores:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://YOUR_URL.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
  ```
- [ ] Guardar archivo

### 3. Probar Localmente (Opcional)

```bash
npm run dev
```

- [ ] Abrir `http://localhost:3000/dashboard`
- [ ] Debe cargar lista con 4 clientes
- [ ] Puede hacer click en un cliente
- [ ] Si funciona: ✅ Todo está bien

**Salir:**
```bash
Ctrl + C
```

---

## 🐙 FASE 3: GITHUB SETUP (5 min)

### 1. Crear Repositorio

- [ ] Ir a [github.com](https://github.com)
- [ ] Click **"+"** → **"New repository"**
- [ ] **Repository name:** `onboarding-hub`
- [ ] **Description:** `Onboarding Hub - PXSOL`
- [ ] **Visibility:** Private (si es interno)
- [ ] **NO inicializar** con README
- [ ] Click **"Create repository"**

### 2. Push de Código

```bash
# En tu terminal (en la carpeta onboarding-hub):

git init
git add .
git commit -m "Initial commit: Onboarding Hub MVP"
git remote add origin https://github.com/TU_USUARIO/onboarding-hub.git
git branch -M main
git push -u origin main
```

- [ ] Esperar a que termine
- [ ] Ir a GitHub, verificar que están todos los archivos

---

## 🚀 FASE 4: VERCEL DEPLOYMENT (10 min)

### 1. Conectar Vercel a GitHub

- [ ] Ir a [vercel.com](https://vercel.com)
- [ ] Click **"Sign Up"** o **"Login"**
- [ ] Click **"Continue with GitHub"**
- [ ] Autorizar Vercel en GitHub

### 2. Importar Proyecto

- [ ] En dashboard Vercel, click **"Add New"** → **"Project"**
- [ ] Buscar: `onboarding-hub`
- [ ] Seleccionar el repositorio
- [ ] Click **"Import"**

### 3. Configurar Environment Variables

En la pantalla "Configure Project":

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL
- [ ] Click en campo de env vars
- [ ] **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- [ ] **Value:** (pegar tu URL de Supabase)
  - Ej: `https://xxxxxxxxxxxx.supabase.co`
- [ ] Aplicar a: **All Environments**
- [ ] Click agregar

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] **Value:** (pegar tu anon key)
- [ ] Aplicar a: **All Environments**
- [ ] Click agregar

#### Variable 3: SUPABASE_SERVICE_ROLE_KEY
- [ ] **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **Value:** (pegar tu service role key)
- [ ] Aplicar a: **All Environments**
- [ ] Click agregar

### 4. Deploy

- [ ] Click **"Deploy"**
- [ ] ⏳ Esperar a que compile (3-5 min)
- [ ] Debe decir **"✓ Ready"** cuando termine
- [ ] Copiar URL de producción (ej: `https://onboarding-hub-XXXXX.vercel.app`)

---

## ✅ FASE 5: VERIFICACIÓN FINAL (5 min)

### 1. Acceder a la App

- [ ] Abrir URL de Vercel en navegador
- [ ] Debe cargar sin errores

### 2. Checklist Funcional

- [ ] ✅ Página de inicio carga
- [ ] ✅ Link "Dashboard" funciona
- [ ] ✅ Dashboard muestra 4 clientes
- [ ] ✅ Puedo hacer click en cliente "Hotel Fierro"
- [ ] ✅ Veo checklist de pasos
- [ ] ✅ Monitor de adopción tiene score y recomendaciones
- [ ] ✅ Puedo cambiar estado de un paso
- [ ] ✅ Los cambios se guardan

### 3. Troubleshooting (Si algo falla)

#### Error 500 / "Internal Server Error"
```bash
→ Ir a Vercel Project Settings
→ Environment Variables
→ Verificar las 3 variables están correctas (sin espacios)
→ Redeploy (click los 3 puntos en deployment)
```

#### Error "Table does not exist"
```bash
→ Volver a Supabase SQL Editor
→ Nueva query
→ Pegar schema.sql
→ Run
```

#### No se ven los 4 clientes
```bash
→ Ir a Supabase Table Editor
→ Click en "clients"
→ Debe mostrar 4 registros
→ Si no hay: ejecutar INSERT en SQL Editor
```

---

## 📊 RESUMEN POST-DEPLOYMENT

**URL de Producción:**
```
https://onboarding-hub-XXXXX.vercel.app
```

**Base de Datos:**
```
Supabase: https://app.supabase.com/project/xxxxxxxxxxxx
```

**Repositorio:**
```
GitHub: https://github.com/TU_USUARIO/onboarding-hub
```

**Dashboard Vercel:**
```
https://vercel.com/dashboard/projects/onboarding-hub
```

---

## 🎯 PRÓXIMOS PASOS

1. [ ] **Compartir URL** con stakeholders
2. [ ] **Recolectar feedback** sobre UI/UX
3. [ ] **Planificar Fase 2:** Integraciones (HubSpot, PMS)
4. [ ] **Capacitar equipo** de onboarding en uso de herramienta

---

## 📞 SOPORTE RÁPIDO

### Si necesitas ver logs:

**En Vercel:**
1. Click en último deployment
2. Ver "Build Logs" para errores de compile
3. Ver "Runtime Logs" para errores en ejecución

**En Supabase:**
1. Ir a SQL Editor
2. Click "Explain" para debuggear queries

### Si algo no funciona:

1. Verificar env vars (sin espacios, valores correctos)
2. Redeploy en Vercel
3. Limpiar cache: `Ctrl + Shift + Del`
4. Recargar página

---

## 🎉 CONCLUSIÓN

**Felicidades! Tu MVP está en producción.**

- ✅ Dashboard funcional
- ✅ Checklist de 20 pasos
- ✅ Monitor de adopción
- ✅ 4 clientes de muestra
- ✅ Datos reales en base de datos
- ✅ URL en producción

**Tiempo total:** ~35 minutos

---

**Documento:** DEPLOYMENT_CHECKLIST.md  
**Versión:** 1.0  
**Última actualización:** Julio 2025
