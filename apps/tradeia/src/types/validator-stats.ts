/**
 * Tipos para el endpoint de Observabilidad de Consenso Estadístico
 * GET /strategies/validator/stats
 */

export interface SignalDistribution {
  BUY: number;
  SELL: number;
}

export interface RejectionReasons {
  [reason: string]: number;
}

export interface ValidatorStatsItem {
  symbol: string;
  timeframe: string;
  strategy_id: string;
  total_signals: number;
  approved_signals: number;
  rejected_signals: number;
  avg_sharpe: number;
  avg_win_rate: number;
  avg_expected_return: number;
  signal_distribution: SignalDistribution;
  rejection_reasons: RejectionReasons;
  last_validation?: string;
  // Risk score: 0-30=green (Low), 31-70=yellow (Moderate), 71-100=red (High/Manual)
  risk_score?: number;
}

export interface ValidatorStatsResponse {
  stats: ValidatorStatsItem[];
}

export interface ValidatorStatsData {
  stats: ValidatorStatsItem[];
  summary: {
    total_symbols: number;
    total_strategies: number;
    total_signals: number;
    total_approved: number;
    total_rejected: number;
    avg_sharpe: number;
    avg_win_rate: number;
    avg_expected_return: number;
    rejection_rate: number;
  };
}
