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

/**
 * Pool Statistics for RangeDetection strategy
 * These fields appear specifically when strategy_id is 'RangeDetection'
 */
export interface PoolStats {
  /** Average width of the trading range as percentage */
  avg_range_width_pct: number;
  /** Average safety margin percentage */
  avg_safety_margin_pct: number;
  /** Number of signals that include hedge protection */
  total_with_hedge: number;
  /** Number of signals with partial protection */
  total_with_protection: number;
  /** Average risk-reward ratio for hedges */
  avg_hedge_risk_reward: number;
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
  /** Pool-specific statistics for RangeDetection strategy */
  pool_stats: PoolStats | null;
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
