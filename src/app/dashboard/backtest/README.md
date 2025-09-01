# Backtesting Feature

This feature allows users to run backtests on trading strategies with various parameters and view the results in a user-friendly interface.

## Features

- Run backtests with customizable parameters
- View detailed trade history with entry/exit points
- Analyze performance metrics including total return and win rate
- Responsive design that works on all device sizes

## API Endpoint

```
POST /api/backtest

Request Body:
{
  "symbol": "BTC/USDT",
  "timeframe": "4h",
  "start_date": "2025-01-01T00:00:00",
  "end_date": "2025-12-31T23:59:59",
  "strategy": "sqzmom_adx",
  "initial_balance": "10000",
  "risk_per_trade": "1"
}
```

### Request Body Parameters

- `symbol`: (string, required) Trading pair (e.g., "BTC/USDT")
- `timeframe`: (string, required) Timeframe for the backtest (e.g., "1m", "5m", "15m", "1h", "4h", "1d")
- `start_date`: (string, required) Start date in ISO 8601 format (e.g., "2025-01-01T00:00:00")
- `end_date`: (string, required) End date in ISO 8601 format (e.g., "2025-12-31T23:59:59")
- `strategy`: (string, required) Strategy to use for backtesting (currently supports "sqzmom_adx")
- `initial_balance`: (string, optional, default: "10000") Starting balance in USDT
- `risk_per_trade`: (string, optional, default: "1") Risk per trade as a percentage (1-100)

## Components

- `page.tsx`: Main component containing the backtest form and results display
- `route.ts`: API route that handles the backtest requests

## Environment Variables

Make sure to set the following environment variable in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
BACKTEST_SERVICE_URL=your_backtest_service_url
```

## Testing

To test the backtesting feature:

1. Navigate to `/dashboard/backtest`
2. Fill in the form with your desired parameters
3. Click "Run Backtest"
4. View the results in the table below the form

## Error Handling

The feature includes comprehensive error handling for:
- Missing or invalid parameters
- Authentication errors
- API connection issues
- Data validation errors
