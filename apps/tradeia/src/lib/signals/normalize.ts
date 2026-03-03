import { UnifiedSignal } from './types';

// Helper to extract range values from reason string
function extractRangeFromReason(reason: string | undefined): { range_min?: number; range_max?: number } {
  if (!reason) return {};
  
  // Match patterns like "Pool: [1955.6329 – 2097.5271]" or "Pool: [58750.0 – 61250.0]"
  const poolMatch = reason.match(/Pool:\s*\[([^\s–]+)\s*[–-]\s*([^\s\]]+)\]/);
  if (poolMatch && poolMatch[1] && poolMatch[2]) {
    const range_min = parseFloat(poolMatch[1]);
    const range_max = parseFloat(poolMatch[2]);
    if (!isNaN(range_min) && !isNaN(range_max)) {
      return { range_min, range_max };
    }
  }
  
  return {};
}

// Normalize from an external payload (example given in US-015)
export function normalizeExampleProvider(payload: any): UnifiedSignal {
  const id = payload?.id ?? payload?.signal_id ?? payload?.uuid ?? undefined;
  const symbol = payload?.symbol ?? payload?.pair ?? payload?.market ?? payload?.ticker ?? undefined;
  const timeframe = payload?.timeframe ?? payload?.tf ?? payload?.interval ?? undefined;
  const timestamp = payload?.timestamp ?? payload?.created_at ?? payload?.createdAt ?? payload?.time ?? payload?.ts ?? undefined;
  const execution_timestamp = payload?.execution_timestamp ?? payload?.executionTimestamp ?? undefined;
  const signal_age_hours = payload?.signal_age_hours ?? payload?.signalAgeHours ?? undefined;
  const signal_source = payload?.signal_source ?? payload?.signalSource ?? undefined;
  const type = (payload?.signal_type as UnifiedSignal['type']) || (payload?.type as UnifiedSignal['type']) || 'entry';
  const direction = payload?.signal_direction ?? payload?.direction ?? payload?.side ?? payload?.trend ?? undefined;
  const entry = payload?.entry ?? payload?.entry_price ?? payload?.price ?? undefined;
  const stopLoss = payload?.stop_loss ?? payload?.stopLoss ?? payload?.sl ?? undefined;
  const tpArray = Array.isArray(payload?.tp) ? payload.tp : Array.isArray(payload?.take_profits) ? payload.take_profits : undefined;
  const tp1 = payload?.tp1 ?? (Array.isArray(tpArray) ? tpArray[0] : undefined);
  const tp2 = payload?.tp2 ?? (Array.isArray(tpArray) ? tpArray[1] : undefined);
  const strategyId = payload?.strategy_id ?? payload?.strategy ?? undefined;
  const provider = payload?.provider ?? payload?.source ?? 'external';

  // Range Detection specific fields
  const rangeData = extractRangeFromReason(payload?.reason);
  const range_min = payload?.range_min ?? payload?.rangeMin ?? rangeData.range_min;
  const range_max = payload?.range_max ?? payload?.rangeMax ?? rangeData.range_max;
  const confidence = payload?.confidence ?? payload?.range_confidence ?? undefined;
  
  // Hedge short data
  const hedge_short = payload?.hedge_short ?? payload?.hedgeShort ?? undefined;

  return {
    id: String(id ?? cryptoRandomId()),
    symbol,
    timeframe,
    timestamp,
    execution_timestamp,
    signal_age_hours,
    signal_source,
    type,
    direction,
    strategyId,
    reason: payload?.reason ?? payload?.rationale ?? undefined,
    entry,
    tp1,
    tp2,
    stopLoss,
    marketScenario: payload?.market_scenario ?? payload?.context ?? null,
    createdAt: payload?.created_at ?? payload?.createdAt,
    // Range Detection fields
    range_min,
    range_max,
    confidence: (confidence === 'high' || confidence === 'medium' || confidence === 'low') ? confidence : undefined,
    hedge_short: hedge_short ? {
      entry_price: hedge_short.entry_price ?? hedge_short.entryPrice ?? 0,
      stop_price: hedge_short.stop_price ?? hedge_short.stopPrice ?? 0,
      target_price: hedge_short.target_price ?? hedge_short.targetPrice ?? 0,
      size_suggestion: hedge_short.size_suggestion ?? hedge_short.sizeSuggestion ?? '',
      risk_pct: hedge_short.risk_pct ?? hedge_short.riskPct ?? 0,
      reward_pct: hedge_short.reward_pct ?? hedge_short.rewardPct ?? 0,
      rationale: hedge_short.rationale ?? ''
    } : undefined,
    source: {
      provider,
      generatedBy: payload?.generated_by,
      runId: payload?.cronjob_run_id ?? payload?.run_id,
      status: payload?.generation_status ?? payload?.status,
    },
  };
}

export function cryptoRandomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as any).randomUUID();
  }
  return 'sig_' + Math.random().toString(36).slice(2);
}
