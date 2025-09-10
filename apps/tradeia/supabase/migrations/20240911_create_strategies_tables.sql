-- Create strategies table
CREATE TABLE public.strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
    timeframe TEXT NOT NULL,
    indicators JSONB NOT NULL DEFAULT '[]',
    stop_loss DECIMAL(5,2) DEFAULT 2.0,
    take_profit DECIMAL(5,2) DEFAULT 4.0,
    max_positions INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_strategies table (junction table for many-to-many relationship)
CREATE TABLE public.user_strategies (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    strategy_id UUID NOT NULL REFERENCES public.strategies(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, strategy_id)
);

-- Enable Row Level Security
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_strategies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for strategies
CREATE POLICY "Users can manage their own strategies"
ON public.strategies
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_strategies
CREATE POLICY "Users can manage their strategy relationships"
ON public.user_strategies
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_strategies_user_id ON public.strategies(user_id);
CREATE INDEX idx_strategies_created_at ON public.strategies(created_at);
CREATE INDEX idx_user_strategies_user_id ON public.user_strategies(user_id);
CREATE INDEX idx_user_strategies_strategy_id ON public.user_strategies(strategy_id);
CREATE INDEX idx_user_strategies_is_active ON public.user_strategies(is_active);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_strategies_updated_at
    BEFORE UPDATE ON public.strategies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_strategies_updated_at
    BEFORE UPDATE ON public.user_strategies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments
COMMENT ON TABLE public.strategies IS 'Trading strategies created by users';
COMMENT ON TABLE public.user_strategies IS 'Junction table linking users to their strategies';
COMMENT ON COLUMN public.strategies.indicators IS 'JSON array of technical indicators used by the strategy';