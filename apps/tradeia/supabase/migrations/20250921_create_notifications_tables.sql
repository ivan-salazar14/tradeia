-- Create signals table to store trading signals (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Add direction column if it doesn't exist (for existing tables)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'signals'
        AND column_name = 'direction'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.signals ADD COLUMN direction TEXT NOT NULL DEFAULT 'BUY' CHECK (direction IN ('BUY', 'SELL'));
    END IF;
END $$;

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
    signal_id UUID, -- Will add foreign key constraint after table creation
    notification_type TEXT NOT NULL CHECK (notification_type IN ('email', 'push')),
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending')) DEFAULT 'pending',
    provider_response JSONB,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add foreign key constraint after table creation (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_notifications_history_signal_id'
        AND table_name = 'notifications_history'
    ) THEN
        ALTER TABLE public.notifications_history
        ADD CONSTRAINT fk_notifications_history_signal_id
        FOREIGN KEY (signal_id) REFERENCES public.signals(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Enable Row Level Security (if not already enabled)
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for signals (create if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'signals' AND policyname = 'Users can view signals from their active strategies') THEN
        CREATE POLICY "Users can view signals from their active strategies"
        ON public.signals
        FOR SELECT
        USING (
            strategy_id IN (
                SELECT strategy_id
                FROM public.user_strategies
                WHERE user_id = auth.uid() AND is_active = true
            )
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'signals' AND policyname = 'System can insert signals') THEN
        CREATE POLICY "System can insert signals"
        ON public.signals
        FOR INSERT
        WITH CHECK (true);
    END IF;
END $$;

-- RLS policies for user_notification_preferences (create if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_notification_preferences' AND policyname = 'Users can manage their own notification preferences') THEN
        CREATE POLICY "Users can manage their own notification preferences"
        ON public.user_notification_preferences
        FOR ALL
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- RLS policies for notifications_history (create if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications_history' AND policyname = 'Users can view their own notification history') THEN
        CREATE POLICY "Users can view their own notification history"
        ON public.notifications_history
        FOR SELECT
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications_history' AND policyname = 'System can insert notification history') THEN
        CREATE POLICY "System can insert notification history"
        ON public.notifications_history
        FOR INSERT
        WITH CHECK (true);
    END IF;
END $$;

-- Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_signals_symbol ON public.signals(symbol);
CREATE INDEX IF NOT EXISTS idx_signals_timestamp ON public.signals(timestamp);
CREATE INDEX IF NOT EXISTS idx_signals_strategy_id ON public.signals(strategy_id);
CREATE INDEX IF NOT EXISTS idx_signals_created_at ON public.signals(created_at);

CREATE INDEX IF NOT EXISTS idx_notifications_history_user_id ON public.notifications_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_history_signal_id ON public.notifications_history(signal_id);
CREATE INDEX IF NOT EXISTS idx_notifications_history_status ON public.notifications_history(status);
CREATE INDEX IF NOT EXISTS idx_notifications_history_created_at ON public.notifications_history(created_at);

-- Function to notify new signals
CREATE OR REPLACE FUNCTION notify_new_signal()
RETURNS TRIGGER AS $$
BEGIN
    -- Send notification to pg_notify channel
    PERFORM pg_notify('new_signal', json_build_object(
        'signal_id', NEW.id,
        'symbol', NEW.symbol,
        'direction', NEW.direction,
        'strategy_id', NEW.strategy_id,
        'timestamp', NEW.timestamp
    )::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new signals (create if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers
        WHERE trigger_name = 'signal_notification_trigger'
        AND event_object_table = 'signals'
    ) THEN
        CREATE TRIGGER signal_notification_trigger
            AFTER INSERT ON public.signals
            FOR EACH ROW
            EXECUTE FUNCTION notify_new_signal();
    END IF;
END $$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at (create if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers
        WHERE trigger_name = 'update_signals_updated_at'
        AND event_object_table = 'signals'
    ) THEN
        CREATE TRIGGER update_signals_updated_at
            BEFORE UPDATE ON public.signals
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers
        WHERE trigger_name = 'update_user_notification_preferences_updated_at'
        AND event_object_table = 'user_notification_preferences'
    ) THEN
        CREATE TRIGGER update_user_notification_preferences_updated_at
            BEFORE UPDATE ON public.user_notification_preferences
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Add comments
COMMENT ON TABLE public.signals IS 'Trading signals generated by the system';
COMMENT ON TABLE public.user_notification_preferences IS 'User preferences for signal notifications';
COMMENT ON TABLE public.notifications_history IS 'Audit trail of sent notifications';
COMMENT ON COLUMN public.signals.signal_age_hours IS 'Hours since signal was generated';
COMMENT ON COLUMN public.signals.reward_to_risk IS 'Risk/reward ratio for the signal';