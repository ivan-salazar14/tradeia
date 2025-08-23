# Unified Signal Format

This document defines the normalized data model used across the app, regardless of the external provider.

## Model

```ts
export type SignalDirection = 'BUY' | 'SELL' | 'LONG' | 'SHORT';

export interface UnifiedSignal {
  id: string;
  symbol: string;           // e.g., "BTC/USDT"
  timeframe: string;        // e.g., "4h"
  timestamp: string;        // ISO string
  type: 'entry' | 'exit' | 'update';
  direction: SignalDirection;
  strategyId?: string;
  reason?: string;
  entry?: number;
  tp1?: number;
  tp2?: number;
  stopLoss?: number;
  marketScenario?: string | null;
  createdAt?: string;       // ISO string
  source: {
    provider: string;       // Provider identifier
    generatedBy?: string;   // e.g., cronjob
    runId?: string;         // correlation id if any
    status?: string;        // e.g., success
  };
}
```

## Example Normalization

External example (from US-015):
```json
{
  "id": 87,
  "symbol": "LINK/USDT",
  "timeframe": "4h",
  "timestamp": "2025-08-21T11:00:00",
  "signal_type": "entry",
  "signal_direction": "BUY",
  "strategy_id": "aggressive",
  "reason": "ADX > 10 ...",
  "entry": 24.74,
  "tp1": 27.624173334569186,
  "tp2": 30.508346669138376,
  "stop_loss": 22.81721777695387,
  "market_scenario": null,
  "created_at": "2025-08-21T23:53:45.091232",
  "generated_by": "cronjob",
  "cronjob_run_id": "f0450...",
  "generation_status": "success",
  "provider": "ExampleProvider"
}
```

Normalized to `UnifiedSignal`:
```json
{
  "id": "87",
  "symbol": "LINK/USDT",
  "timeframe": "4h",
  "timestamp": "2025-08-21T11:00:00",
  "type": "entry",
  "direction": "BUY",
  "strategyId": "aggressive",
  "reason": "ADX > 10 ...",
  "entry": 24.74,
  "tp1": 27.624173334569186,
  "tp2": 30.508346669138376,
  "stopLoss": 22.81721777695387,
  "marketScenario": null,
  "createdAt": "2025-08-21T23:53:45.091232",
  "source": {
    "provider": "ExampleProvider",
    "generatedBy": "cronjob",
    "runId": "f0450...",
    "status": "success"
  }
}
```

## Quality Checks
- Required: id, symbol, timeframe, timestamp, direction.
- Numeric fields (entry, tp1, tp2, stopLoss) must be numbers when present.

## Usage
- Backend route: `GET /api/signals` returns `{ items: UnifiedSignal[], count: number }`.
- Filters: supply `symbol`, `timeframe`, and `X-Active-Strategies` header to filter by current user active strategies.
