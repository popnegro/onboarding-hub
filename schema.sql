-- Auth: Supabase auto-creates users table

-- Clientes
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

-- Pasos del onboarding (20 pasos en 4 etapas)
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
  depends_on_step INTEGER, -- step number this depends on
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Videos de capacitación
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

-- Métricas de adopción
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
  risk_level VARCHAR(20), -- alto, medio, bajo
  created_at TIMESTAMP DEFAULT now()
);

-- Envíos de videos
CREATE TABLE IF NOT EXISTS video_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id),
  channel VARCHAR(20), -- email, whatsapp
  sent_at TIMESTAMP DEFAULT now(),
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_clients_onboarder ON clients(assigned_onboarder_id);
CREATE INDEX IF NOT EXISTS idx_steps_client ON onboarding_steps(client_id);
CREATE INDEX IF NOT EXISTS idx_steps_status ON onboarding_steps(status);
CREATE INDEX IF NOT EXISTS idx_adoption_client ON adoption_metrics(client_id);
CREATE INDEX IF NOT EXISTS idx_adoption_date ON adoption_metrics(measurement_date);

-- RLS (Row Level Security) - opcional para MVP
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_sends ENABLE ROW LEVEL SECURITY;

-- Insertar videos de muestra (20 videos para 20 pasos)
INSERT INTO videos (step_number, title, description, url_es, duration_seconds)
VALUES
(1, 'Envío de credenciales', 'Cómo recibir y activar credenciales de acceso', 'https://example.com/paso-1.mp4', 300),
(2, 'Confirmación de acceso', 'Verifica que puedas ingresar al PMS', 'https://example.com/paso-2.mp4', 180),
(3, 'Agenda de capacitación', 'Organiza tu calendario de formación', 'https://example.com/paso-3.mp4', 240),
(4, 'Reunión inicial de kickoff', 'Inicio del proceso de onboarding', 'https://example.com/paso-4.mp4', 600),
(5, 'Carga de estructuras hoteleras', 'Define tus tipos de habitación', 'https://example.com/paso-5.mp4', 480),
(6, 'Configuración de tarifas base', 'Cómo ingresar precios', 'https://example.com/paso-6.mp4', 420),
(7, 'Integración de canales OTA', 'Conecta Booking, Airbnb, Expedia', 'https://example.com/paso-7.mp4', 540),
(8, 'Setup de usuarios y permisos', 'Agrega tu equipo de trabajo', 'https://example.com/paso-8.mp4', 360),
(9, 'Validación de datos maestros', 'Verifica que todo esté correcto', 'https://example.com/paso-9.mp4', 300),
(10, 'Módulo 1: Operación diaria', 'Crear reservas, check-in, check-out', 'https://example.com/paso-10.mp4', 1200),
(11, 'Módulo 2: Tarifas y disponibilidad', 'Gestión de precios dinámicos', 'https://example.com/paso-11.mp4', 900),
(12, 'Módulo 3: Reportes y análisis', 'Cómo usar dashboards', 'https://example.com/paso-12.mp4', 750),
(13, 'Módulo 4: Integraciones avanzadas', 'APIs y conexiones extra', 'https://example.com/paso-13.mp4', 600),
(14, 'Ejercicios prácticos', 'Simulacros y casos de uso', 'https://example.com/paso-14.mp4', 1800),
(15, 'Testing E2E de flujos', 'Valida reserva → OTA → Check-in', 'https://example.com/paso-15.mp4', 1200),
(16, 'Conexión POS/Housekeeping', 'Integra sistemas adicionales', 'https://example.com/paso-16.mp4', 600),
(17, 'Validación de reportes', 'Verifica que la data sea correcta', 'https://example.com/paso-17.mp4', 480),
(18, 'Go-live coordination', 'Coordinación del lanzamiento', 'https://example.com/paso-18.mp4', 900),
(19, 'Monitoreo post-lanzamiento', 'Primeros 7 días de seguimiento', 'https://example.com/paso-19.mp4', 300),
(20, 'Cierre y handoff a soporte', 'Transición a soporte técnico', 'https://example.com/paso-20.mp4', 600);

-- Insertar clientes de muestra (en diferentes etapas)
INSERT INTO clients (name, email, current_etapa, status, created_at)
VALUES
('Hotel Fierro Buenos Aires', 'contacto@fierro.com', 2, 'active', now() - interval '8 days'),
('Hotel Fierro Mendoza', 'contacto@fierromza.com', 3, 'active', now() - interval '22 days'),
('Fierro Patagonia', 'contacto@fierropatagon.com', 4, 'active', now() - interval '29 days'),
('Fierro Córdoba', 'contacto@fierrocba.com', 1, 'active', now() - interval '1 days');

-- Insertar métricas de muestra (adopción simulada)
INSERT INTO adoption_metrics (client_id, measurement_date, reservations_7d, active_users, rates_updated, reports_generated, integrations_active, adoption_score, risk_level)
SELECT
  c.id,
  now()::date,
  CASE 
    WHEN c.current_etapa = 2 THEN 2
    WHEN c.current_etapa = 3 THEN 45
    WHEN c.current_etapa = 4 THEN 125
    ELSE 0
  END,
  CASE
    WHEN c.current_etapa = 2 THEN 1
    WHEN c.current_etapa >= 3 THEN 5
    ELSE 0
  END,
  c.current_etapa >= 2,
  CASE
    WHEN c.current_etapa >= 3 THEN 8
    WHEN c.current_etapa >= 4 THEN 20
    ELSE 0
  END,
  CASE
    WHEN c.current_etapa >= 3 THEN 2
    WHEN c.current_etapa >= 4 THEN 4
    ELSE 0
  END,
  CASE
    WHEN c.current_etapa = 2 THEN 45
    WHEN c.current_etapa = 3 THEN 65
    WHEN c.current_etapa = 4 THEN 85
    ELSE 15
  END,
  CASE
    WHEN c.current_etapa = 2 THEN 'medio'
    WHEN c.current_etapa >= 3 THEN 'alto'
    ELSE 'bajo'
  END
FROM clients c;