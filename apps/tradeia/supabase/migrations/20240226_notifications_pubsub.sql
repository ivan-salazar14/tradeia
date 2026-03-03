-- Migration: Create notification event logging tables
-- Date: 2024-02-26
-- Description: Tablas para el sistema de notificaciones basado en Pub/Sub

-- Tabla para registrar eventos de señales procesados
CREATE TABLE IF NOT EXISTS signal_events_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  source VARCHAR(50) NOT NULL,
  correlation_id VARCHAR(255),
  payload JSONB NOT NULL,
  users_notified INTEGER DEFAULT 0,
  notifications_failed INTEGER DEFAULT 0,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_signal_events_log_event_id ON signal_events_log(event_id);
CREATE INDEX IF NOT EXISTS idx_signal_events_log_event_type ON signal_events_log(event_type);
CREATE INDEX IF NOT EXISTS idx_signal_events_log_source ON signal_events_log(source);
CREATE INDEX IF NOT EXISTS idx_signal_events_log_created_at ON signal_events_log(created_at DESC);

-- Tabla de preferencias de notificación (ya debería existir, pero verificamos)
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  strategies TEXT[] DEFAULT ARRAY['moderate', 'conservative'],
  symbols TEXT[] DEFAULT ARRAY['BTC/USDT', 'ETH/USDT'],
  timeframes TEXT[] DEFAULT ARRAY['1H', '4H', '1D'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de historial de notificaciones (ya debería existir, pero verificamos)
CREATE TABLE IF NOT EXISTS notifications_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  signal_id VARCHAR(255),
  notification_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  provider_response JSONB,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para historial de notificaciones
CREATE INDEX IF NOT EXISTS idx_notifications_history_user_id ON notifications_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_history_signal_id ON notifications_history(signal_id);
CREATE INDEX IF NOT EXISTS idx_notifications_history_status ON notifications_history(status);
CREATE INDEX IF NOT EXISTS idx_notifications_history_created_at ON notifications_history(created_at DESC);

-- Función para actualizar timestamp en preferencias
CREATE OR REPLACE FUNCTION update_user_notification_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar timestamp
DROP TRIGGER IF EXISTS update_user_notification_preferences_timestamp ON user_notification_preferences;
CREATE TRIGGER update_user_notification_preferences_timestamp
  BEFORE UPDATE ON user_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_notification_preferences_timestamp();

-- Habilitar Row Level Security
ALTER TABLE signal_events_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para signal_events_log
CREATE POLICY "Service can insert signal_events_log" ON signal_events_log
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Users can view own notification history" ON notifications_history
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own preferences" ON user_notification_preferences
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own preferences" ON user_notification_preferences
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Comentarios
COMMENT ON TABLE signal_events_log IS 'Registro de eventos de señales procesados desde Pub/Sub';
COMMENT ON TABLE user_notification_preferences IS 'Preferencias de notificación por usuario';
COMMENT ON TABLE notifications_history IS 'Historial de notificaciones enviadas';
