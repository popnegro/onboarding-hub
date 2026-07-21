# 🚀 DEPLOYMENT VERCEL - GUÍA COMPLETA

**Tiempo estimado: 20 minutos**

---

## PASO 1: Preparar Supabase (5 min)

### 1.1 Crear proyecto Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Click "Start Your Project" (o Login si ya tienes cuenta)
3. Click "New Project"
4. Configurar:
   - **Organization**: Crear nueva o seleccionar
   - **Project name**: `pxsol-onboarding-hub`
   - **Database password**: Guardar en lugar seguro
   - **Region**: `South America (São Paulo)` o más cercana
5. Click "Create new project"
6. **Esperar 3-5 minutos** a que se inicialice

### 1.2 Obtener Credenciales

Una vez inicializado:

1. Go to **Settings** → **API**
2. Copiar:
   - `Project URL` (ej: `https://xxxxxxxxxxxx.supabase.co`)
   - `anon public` key
   - Service `service_role` key (scroll down)

3. **Guardar estos 3 valores** en un editor de texto (los necesitarás pronto)

### 1.3 Crear Tablas y Datos

1. En Supabase dashboard, ir a **SQL Editor**
2. Click **"New Query"**
3. Copiar y pegar **TODO el contenido de `schema.sql`**:
   ```sql
   -- Pegar aquí el contenido completo de schema.sql
   ```
4. Click **"Run"** (arriba a la derecha)
5. Esperar a que se complete (debe decir "✓ Query successful")
6. Verificar en **Table Editor** que aparecen:
   - `clients` (4 registros)
   - `onboarding_steps` (80 registros)
   - `videos` (20 registros)
   - `adoption_metrics` (4 registros)

✅ **Supabase está listo**

---

## PASO 2: Preparar Código (2 min)

### 2.1 Clonar/Descargar Repo

```bash
# Opción A: Si tienes Git
git clone https://github.com/TU_USUARIO/onboarding-hub.git
cd onboarding-hub

# Opción B: Si descargaste ZIP
unzip onboarding-hub.zip
cd onboarding-hub
```

### 2.2 Instalar Dependencias

```bash
npm install
# o yarn install
```

### 2.3 Configurar Variables Locales (Opcional, para testing)

```bash
cp .env.example .env.local
```

Editar `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_URL.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 2.4 Probar Localmente (Opcional)

```bash
npm run dev
# Abrir http://localhost:3000/dashboard
# Debe cargar con 4 clientes de muestra
```

✅ **Código está listo**

---

## PASO 3: Subir a GitHub (3 min)

### 3.1 Crear Repositorio GitHub

1. Ir a [github.com](https://github.com)
2. Click **"+"** → **"New repository"**
3. Configurar:
   - **Repository name**: `onboarding-hub`
   - **Description**: `Onboarding Hub - PXSOL`
   - **Private** (opcional, si es interno)
   - **Initialize with**: No seleccionar nada
4. Click **"Create repository"**

### 3.2 Subir Código

```bash
cd onboarding-hub

# Inicializar Git (si no está)
git init

# Agregar archivos
git add .

# Commit
git commit -m "Initial commit: Onboarding Hub MVP"

# Conectar con GitHub
git remote add origin https://github.com/TU_USUARIO/onboarding-hub.git
git branch -M main
git push -u origin main

# Verificar en GitHub que están todos los archivos
```

✅ **Código está en GitHub**

---

## PASO 4: Deploy a Vercel (10 min)

### Opción A: Dashboard Vercel (Recomendado)

#### 4A.1 Conectar con GitHub

1. Ir a [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (o Login si tienes cuenta)
3. Click **"Continue with GitHub"**
4. Autorizar Vercel en GitHub

#### 4A.2 Importar Proyecto

1. En dashboard Vercel, click **"Add New..."** → **"Project"**
2. Buscar y seleccionar: `onboarding-hub`
3. Click **"Import"**

#### 4A.3 Configurar Environment Variables

En la pantalla "Configure Project":

1. Expandir **"Environment Variables"**
2. Agregar 3 variables:

   **Variable 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: (tu URL de Supabase copiada en Paso 1)
   - Aplicar a: All environments

   **Variable 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: (tu anon key de Supabase)
   - Aplicar a: All environments

   **Variable 3:**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: (tu service role key de Supabase)
   - Aplicar a: Production & Preview

3. Click **"Deploy"**

#### 4A.4 Esperar Deployment

- Vercel comenzará a buildear automáticamente
- Puedes ver el progreso en tiempo real
- Esperar hasta que vea **"✓ Ready"** (3-5 min)

#### 4A.5 Obtener URL de Producción

```
https://onboarding-hub-XXXXX.vercel.app
```

✅ **App está en producción**

---

### Opción B: CLI Vercel (Alternativo)

Si prefieres línea de comandos:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Ir a carpeta del proyecto
cd onboarding-hub

# Deploy
vercel

# Responder preguntas:
# "Set up and deploy?" → y
# "Which scope?" → Tu usuario/org
# "Link to existing project?" → n
# "Project name?" → onboarding-hub
# "In which directory?" → ./
# "Command for `prod`" → npm run build (Enter)
# "Output directory?" → .next

# Despues, configurar env vars
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Pegar tu URL

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Pegar tu anon key

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Pegar tu service role key

# Deploy final a producción
vercel --prod
```

✅ **App está en producción**

---

## PASO 5: Verificación Final (2 min)

### 5.1 Acceder a la App

```
https://onboarding-hub-XXXXX.vercel.app
```

### 5.2 Checklist

- [ ] Página carga sin errores
- [ ] Puedo navegar a `/dashboard`
- [ ] Veo 4 clientes de muestra
- [ ] Puedo hacer click en un cliente
- [ ] Veo checklist de pasos
- [ ] Puedo cambiar estado de paso
- [ ] Monitor de adopción se muestra correctamente

### 5.3 Si algo falla

#### Error: "500 - Internal Server Error"

```bash
# Verificar env vars en Vercel:
1. Ir a Project Settings
2. Click "Environment Variables"
3. Copiar exactamente desde Supabase (sin espacios)
4. Click los 3 puntos en deployment
5. Click "Redeploy"
```

#### Error: "Table does not exist"

```bash
# Volver a ejecutar schema.sql en Supabase:
1. SQL Editor → New Query
2. Pegar schema.sql completo
3. Click "Run"
```

#### Error: "Connection refused"

```bash
# Las env vars no están correctas:
1. Verificar en Vercel que están configuradas
2. Esperar 30 segundos
3. Recargar página
```

---

## PASO 6: Configurar Dominio Personalizado (Opcional)

En Vercel Project Settings:

1. Click **"Domains"**
2. Agregar dominio (ej: `onboarding.pxsol.com`)
3. Seguir instrucciones para DNS

---

## 📋 CHECKLIST FINAL

- [x] Supabase proyecto creado
- [x] Tablas y datos importados
- [x] Código en GitHub
- [x] Variables de entorno configuradas
- [x] Deploy completado en Vercel
- [x] App funcionando en producción
- [x] Clientes de muestra visibles
- [x] Checklist editable

---

## 🎉 ¡LISTO!

Tu MVP está en producción y accesible desde cualquier lugar.

**URL de Producción:**
```
https://onboarding-hub-XXXXX.vercel.app
```

**Próximos pasos:**
1. Compartir URL con stakeholders
2. Recolectar feedback
3. Integrar con HubSpot (Fase 2)
4. Integrar con PMS (Fase 2)

---

## 🆘 Soporte

**Si necesitas ayuda:**

1. Revisar logs en Vercel:
   - Project → Deployments → Click último
   - Ver "Build Logs" o "Runtime Logs"

2. Verificar Supabase:
   - SQL Editor → Ejecutar queries manual
   - Table Editor → Verificar datos

3. Testing local:
   ```bash
   npm run dev
   # Si funciona local pero no en Vercel, es problema de env vars
   ```

---

**Deployment completado en ~20 minutos. ✨**
