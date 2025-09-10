import { UnifiedSignal } from './types';

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
