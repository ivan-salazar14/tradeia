-- Create signals table to store trading signals
CREATE TABLE public.signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    execution_timestamp TIMESTAMPTZ,
    signal_age_hours DECIMAL(5,2),
    signal_source TEXT DEFAULT 'generated',
    type TEXT NOT NULL CHECK (type IN ('entry', 'exit')),
    direction TEXT NOT NULL CHECK (direction IN ('BUY', 'SELL')),
    strategy_id TEXT,
    entry DECIMAL(20,8),
    tp1 DECIMAL(20,8),
    tp2 DECIMAL(20,8),
    stop_loss DECIMAL(20,8),
    source JSONB,
    position_size DECIMAL(20,8),
    risk_amount DECIMAL(20,8),
    reward_to_risk DECIMAL(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_notification_preferences table
CREATE TABLE public.user_notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    strategies TEXT[] DEFAULT ARRAY['moderate', 'conservative'],
    symbols TEXT[] DEFAULT ARRAY['BTC/USDT', 'ETH/USDT'],
    timeframes TEXT[] DEFAULT ARRAY['1H', '4H', '1D'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notifications_history table for audit trail
CREATE TABLE public.notifications_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    signal_id UUID REFERENCES public.signals(id) ON DELETE SET NULL,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('email', 'push')),
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending')) DEFAULT 'pending',
    provider_response JSONB,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for signals
CREATE POLICY "Users can view signals from their active strategies"
ON public.signals
FOR SELECT
USING (
    user_id = auth.uid() OR
    strategy_id IN (
        SELECT strategy_id
        FROM public.user_strategies
        WHERE user_id = auth.uid() AND is_active = true
    )
);

CREATE POLICY "System can insert signals"
ON public.signals
FOR INSERT
WITH CHECK (true);

-- RLS policies for user_notification_preferences
CREATE POLICY "Users can manage their own notification preferences"
ON public.user_notification_preferences
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS policies for notifications_history
CREATE POLICY "Users can view their own notification history"
ON public.notifications_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notification history"
ON public.notifications_history
FOR INSERT
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_signals_user_id ON public.signals(user_id);
CREATE INDEX idx_signals_symbol ON public.signals(symbol);
CREATE INDEX idx_signals_timestamp ON public.signals(timestamp);
CREATE INDEX idx_signals_strategy_id ON public.signals(strategy_id);
CREATE INDEX idx_signals_created_at ON public.signals(created_at);

CREATE INDEX idx_notifications_history_user_id ON public.notifications_history(user_id);
CREATE INDEX idx_notifications_history_signal_id ON public.notifications_history(signal_id);
CREATE INDEX idx_notifications_history_status ON public.notifications_history(status);
CREATE INDEX idx_notifications_history_created_at ON public.notifications_history(created_at);

-- Function to notify new signals
CREATE OR REPLACE FUNCTION notify_new_signal()
RETURNS TRIGGER AS $$
BEGIN
    -- Send notification to pg_notify channel
    PERFORM pg_notify('new_signal', json_build_object(
        'signal_id', NEW.id,
        'user_id', NEW.user_id,
        'symbol', NEW.symbol,
        'direction', NEW.direction,
        'strategy_id', NEW.strategy_id,
        'timestamp', NEW.timestamp
    )::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new signals
CREATE TRIGGER signal_notification_trigger
    AFTER INSERT ON public.signals
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_signal();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_signals_updated_at
    BEFORE UPDATE ON public.signals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_notification_preferences_updated_at
    BEFORE UPDATE ON public.user_notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments
COMMENT ON TABLE public.signals IS 'Trading signals generated by the system';
COMMENT ON TABLE public.user_notification_preferences IS 'User preferences for signal notifications';
COMMENT ON TABLE public.notifications_history IS 'Audit trail of sent notifications';
COMMENT ON COLUMN public.signals.signal_age_hours IS 'Hours since signal was generated';
COMMENT ON COLUMN public.signals.reward_to_risk IS 'Risk/reward ratio for the signal';