-- Seed system strategies
-- First, make user_id nullable for system strategies
ALTER TABLE public.strategies ALTER COLUMN user_id DROP NOT NULL;

-- Insert system strategies
INSERT INTO public.strategies (id, user_id, name, description, risk_level, timeframe, indicators, stop_loss, take_profit, max_positions) VALUES
('550e8400-e29b-41d4-a716-446655440001', NULL, 'conservative', 'Low-risk strategy with strict entry conditions', 'Low', '4h', '["RSI", "ADX", "SMA"]', 2.0, 4.0, 2),
('550e8400-e29b-41d4-a716-446655440002', NULL, 'moderate', 'Balanced risk-reward strategy', 'Medium', '4h', '["RSI", "ADX", "SQZMOM"]', 2.0, 4.0, 3),
('550e8400-e29b-41d4-a716-446655440003', NULL, 'aggressive', 'High-risk strategy for maximum returns', 'High', '4h', '["RSI", "ADX", "SQZMOM"]', 1.5, 6.0, 5),
('550e8400-e29b-41d4-a716-446655440004', NULL, 'sqzmom_adx', 'Advanced strategy using squeeze momentum and ADX indicators', 'Medium', '4h', '["SQZMOM", "ADX", "RSI"]', 2.0, 5.0, 3),
('550e8400-e29b-41d4-a716-446655440005', NULL, 'scenario_based', 'Dynamic strategy that adapts to market conditions', 'Medium', '4h', '["RSI", "ADX", "VOLUME"]', 2.5, 4.5, 3),
('550e8400-e29b-41d4-a716-446655440006', NULL, 'onda_3_5_alcista', 'Detecta oportunidades de compra en tendencias alcistas fuertes', 'Medium', '4h', '["RSI", "ADX", "WAVE"]', 2.0, 4.0, 3),
('550e8400-e29b-41d4-a716-446655440007', NULL, 'onda_c_bajista', 'Detecta oportunidades de venta en tendencias bajistas fuertes', 'Medium', '4h', '["RSI", "ADX", "WAVE"]', 2.0, 4.0, 3),
('550e8400-e29b-41d4-a716-446655440008', NULL, 'ruptura_rango', 'Detecta rupturas de consolidación con momentum confirmado', 'Medium', '4h', '["RSI", "ADX", "BREAKOUT"]', 2.0, 4.0, 3),
('550e8400-e29b-41d4-a716-446655440009', NULL, 'reversion_patron', 'Detecta patrones de reversión con confirmación técnica', 'Medium', '4h', '["RSI", "ADX", "PATTERN"]', 2.0, 4.0, 3),
('550e8400-e29b-41d4-a716-446655440010', NULL, 'gestion_riesgo', 'Gestión avanzada de riesgo con trailing stops dinámicos', 'Low', '4h', '["RSI", "ADX", "TRAILING"]', 1.0, 3.0, 2),
('550e8400-e29b-41d4-a716-446655440011', NULL, 'advanced_ta', 'Advanced technical analysis strategy', 'High', '4h', '["RSI", "ADX", "SQZMOM", "VOLUME", "MACD"]', 1.5, 6.0, 4);

-- Update RLS policy to allow access to system strategies (user_id IS NULL)
DROP POLICY IF EXISTS "Users can manage their own strategies" ON public.strategies;
CREATE POLICY "Users can view all strategies, manage their own"
ON public.strategies
FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own strategies"
ON public.strategies
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own strategies"
ON public.strategies
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own strategies"
ON public.strategies
FOR DELETE
USING (auth.uid() = user_id);