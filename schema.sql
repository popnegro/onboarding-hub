-- PXSOL Onboarding Hub
-- Esquema base para una instalación nueva.
-- No incluye clientes, métricas ni videos de demostración.
-- Las políticas RLS deben definirse según el modelo de autenticación antes
-- de habilitar el acceso de usuarios finales.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Videos de capacitación (se crea antes de onboarding_steps por su FK).
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url_es VARCHAR(500),
  url_en VARCHAR(500),
  url_pt VARCHAR(500),
  duration_seconds INTEGER,
  thumbnail_url VARCHAR(500),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Clientes.
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hubspot_deal_id VARCHAR(50) UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  assigned_onboarder_id UUID REFERENCES auth.users(id),
  current_etapa INTEGER DEFAULT 1,
  progress_percentage NUMERIC(5, 2) DEFAULT 0,
  adoption_score INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active', -- active, completed, archived
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Pasos del onboarding (20 pasos en 4 etapas).
CREATE TABLE IF NOT EXISTS onboarding_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL, -- 1-20
  etapa INTEGER NOT NULL, -- 1-4
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed, verified
  estimated_date DATE,
  completed_date TIMESTAMP,
  notes TEXT,
  blocker_reason TEXT,
  video_id UUID REFERENCES videos(id),
  depends_on_step INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT onboarding_steps_client_step_unique UNIQUE (client_id, step_number)
);

-- Métricas de adopción. Los registros deben provenir de una fuente verificada.
CREATE TABLE IF NOT EXISTS adoption_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  measurement_date DATE NOT NULL,
  reservations_7d INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  rates_updated BOOLEAN DEFAULT FALSE,
  reports_generated INTEGER DEFAULT 0,
  integrations_active INTEGER DEFAULT 0,
  adoption_score INTEGER DEFAULT 0,
  risk_level VARCHAR(20), -- alto, medio, bajo (categorías documentadas)
  created_at TIMESTAMP DEFAULT now()
);

-- Historial de envíos de videos. No se automatizan envíos desde este esquema.
CREATE TABLE IF NOT EXISTS video_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id),
  channel VARCHAR(20), -- email, whatsapp
  sent_at TIMESTAMP DEFAULT now(),
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP
);

-- Índices.
CREATE INDEX IF NOT EXISTS idx_clients_onboarder ON clients(assigned_onboarder_id);
CREATE INDEX IF NOT EXISTS idx_steps_client ON onboarding_steps(client_id);
CREATE INDEX IF NOT EXISTS idx_steps_status ON onboarding_steps(status);
CREATE INDEX IF NOT EXISTS idx_adoption_client ON adoption_metrics(client_id);
CREATE INDEX IF NOT EXISTS idx_adoption_date ON adoption_metrics(measurement_date);
CREATE INDEX IF NOT EXISTS idx_video_sends_client ON video_sends(client_id);

-- RLS permanece habilitado. Sin políticas explícitas, el acceso vía anon key
-- queda denegado por defecto. Definir políticas según roles antes de producción.
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_sends ENABLE ROW LEVEL SECURITY;
