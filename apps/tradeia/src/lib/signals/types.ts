export type SignalDirection = 'BUY' | 'SELL' | 'LONG' | 'SHORT';

export interface UnifiedSignal {
  id: string;
  symbol: string; // e.g., BTC/USDT
  timeframe: string; // e.g., 4h
  timestamp: string; // ISO string
  type: 'entry' | 'exit' | 'update';
  direction: SignalDirection; // normalized
  strategyId?: string;
  reason?: string;
  entry?: number;
  tp1?: number;
  tp2?: number;
  stopLoss?: number;
  marketScenario?: string | null;
  createdAt?: string; // ISO string
  source: {
    provider: string; // Provider identifier
    generatedBy?: string; // e.g., cronjob
    runId?: string; // optional correlation id
    status?: string; // e.g., success
  };
}

export interface ProviderRequestOptions {
  symbol?: string;
  timeframe?: string;
  limit?: number;
  offset?: number;
}
