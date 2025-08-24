# Strategies Developer Reference

This document describes the currently implemented trading strategies and the signal schema returned by the API.

## Available Strategies and IDs
Defined in `src/application/strategies/strategy_factory.py` (`StrategyFactory._strategies`):
- conservative -> `ConservativeStrategy`
- moderate -> `ModerateStrategy`
- aggressive -> `AggressiveStrategy`

## Common Signal Schema (API)
Signals in API responses share the same schema in English across GET /signals and POST /signals/generate.

Per signal fields:
- id: integer | null
- symbol: string (e.g., "BTC/USDT")
- timeframe: string (e.g., "4h")
- timestamp: ISO-8601 string
- signal_type: string ("entry")
- signal_direction: string ("BUY" | "SELL")
- type: string (alias of signal_direction)
- strategy_id: string (identifier of the strategy that generated the signal)
- reason: string (human-readable rationale)
- entry: number
- tp1: number (rounded to 2 decimals in API)
- tp2: number | null (rounded to 2 decimals in API)
- stop_loss: number (rounded to 2 decimals in API)
- stopLoss: number (camelCase alias, rounded)
- market_scenario: string | null
- created_at: ISO-8601 string
- sent_at: ISO-8601 string
- generated_by: string ("manual" | "cronjob")
- cronjob_run_id: string | null
- generation_status: string (e.g., "success")

Notes:
- Rounding to 2 decimals for tp1, tp2, and stop_loss is applied in the API layer (`market_data_handler.py`).
- POST /signals/generate (DB branch) additionally filters to only return complete signals (entry, tp1, stop_loss not null).

## Strategy: ModerateStrategy
File: `src/application/strategies/moderate_strategy.py`

Summary:
- Name: "Moderada"
- Risk level: "moderate"
- Philosophy: Balanced quality and frequency. 3 of 5 conditions required.

Decision thresholds:
- rsi_oversold: 30
- rsi_overbought: 70
- adx_min: 20
- sqzmom_min: 7
- dmi_difference_min: 6
- atr_min: 35
- required_conditions: 3 (out of the 5 below)

Conditions (any 3 must be met):
1) RSI < 30 or RSI > 70
2) ADX > 20
3) |SQZMOM| > 7
4) |DMI+ - DMI-| > 6
5) ATR > 35

Direction selection:
- Prefer RSI extremes: RSI < 30 => BUY; RSI > 70 => SELL
- If RSI neutral, use DMI dominance if |DMI+ - DMI-| > 6
  - DMI+ > DMI- => BUY
  - DMI- > DMI+ => SELL

Risk parameters (multipliers over ATR):
- TP1: ATR × 2.0
- TP2: ATR × 4.0
- Stop-Loss: ATR × 1.5

Parameter computation:
- BUY: entry = close; tp1=entry+ATR*2.0; tp2=entry+ATR*4.0; stop=entry-ATR*1.5
- SELL: entry = close; tp1=entry-ATR*2.0; tp2=entry-ATR*4.0; stop=entry+ATR*1.5

Reason string components include thresholds met for RSI/ADX/SQZMOM/DMI and ATR adequacy.

## Strategy: ConservativeStrategy
File: `src/application/strategies/conservative_strategy.py`

Summary:
- Name: "Conservadora"
- Risk level: "conservative"
- Philosophy: Very strict; all 5 conditions must be met.

Decision thresholds:
- rsi_oversold: 25
- rsi_overbought: 75
- adx_min: 30
- sqzmom_min: 15
- dmi_difference_min: 12
- atr_min: 100
- required_conditions: 5 (all)

Conditions (all must be met):
1) RSI < 25 or RSI > 75
2) ADX > 30
3) |SQZMOM| > 15
4) |DMI+ - DMI-| > 12
5) ATR > 100

Direction selection:
- Requires RSI extreme plus DMI confirmation:
  - RSI < 25 and DMI+ > DMI- => BUY
  - RSI > 75 and DMI- > DMI+ => SELL

Risk parameters (multipliers over ATR):
- TP1: ATR × 1.5
- TP2: ATR × 2.5
- Stop-Loss: ATR × 1.0

Parameter computation:
- BUY: entry = close; tp1=entry+ATR*1.5; tp2=entry+ATR*2.5; stop=entry-ATR*1.0
- SELL: entry = close; tp1=entry-ATR*1.5; tp2=entry-ATR*2.5; stop=entry+ATR*1.0

Reason string components include detailed references to thresholds (RSI, ADX, SQZMOM, DMI difference) and ATR high volatility.

## Example response object (truncated)
```
{
  "id": 123,
  "symbol": "BTC/USDT",
  "timeframe": "4h",
  "timestamp": "2025-08-23T00:00:00Z",
  "signal_type": "entry",
  "signal_direction": "BUY",
  "type": "BUY",
  "strategy_id": "moderate",
  "reason": "RSI < 30 (sobreventa), ADX > 20 (tendencia moderada), SQZMOM = 8.1 (momentum moderado), DMI confirmado (diferencia > 6), Volatilidad adecuada (ATR > 35)",
  "entry": 61000.0,
  "tp1": 62000.0,
  "tp2": 65000.0,
  "stop_loss": 59500.0,
  "stopLoss": 59500.0,
  "market_scenario": "trend",
  "created_at": "2025-08-23T00:00:00Z",
  "sent_at": "2025-08-23T00:00:00Z",
  "generated_by": "manual",
  "cronjob_run_id": null,
  "generation_status": "success"
}
```

## Notes for developers
- Strategy outputs use raw floating values; rounding is applied at the API serialization layer.
- `strategy_id` is attached when saving signals through the service layer; ensure it is present for analytics and filtering.
- To add a new strategy, mirror the BaseStrategy interface and expose thresholds, direction logic, and ATR-based parameter multipliers clearly, then extend the API docs here.

### Known inconsistencies (to consider fixing)
- `src/domain/entities/ohlcv.py` defines `Signal.signal_direction: Literal["BUY", "SHORT"]`, but all strategies set and API returns `"BUY" | "SELL"`. Prefer updating the dataclass to include "SELL" (or allow both) to align with runtime values and API responses.
