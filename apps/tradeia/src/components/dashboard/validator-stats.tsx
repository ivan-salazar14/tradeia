'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ValidatorStatsItem, ValidatorStatsData } from '@/types/validator-stats';
import { env } from 'process';

export default function ValidatorStats() {
  const { session, loading: authLoading } = useAuth();
  const [data, setData] = useState<ValidatorStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      fetchValidatorStats();
    }
  }, [session, authLoading]);

  const fetchValidatorStats = async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      var url = new URL('/strategies/validator/stats', process.env.SIGNALS_API_BASE || 'http://localhost:8000');
      console.log('[VALIDATOR STATS] Fetching from URL:', url.toString());
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch validator stats: ${response.status}`);
      }

      const result = await response.json();
      
      // Calculate summary from stats
      const stats: ValidatorStatsItem[] = result.stats || [];
      const summary = calculateSummary(stats);
      
      setData({ stats, summary });
    } catch (err) {
      console.error('Error fetching validator stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load validator statistics');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (stats: ValidatorStatsItem[]) => {
    const totalSymbols = new Set(stats.map(s => s.symbol)).size;
    const totalStrategies = new Set(stats.map(s => s.strategy_id)).size;
    const totalSignals = stats.reduce((acc, s) => acc + s.total_signals, 0);
    const totalApproved = stats.reduce((acc, s) => acc + s.approved_signals, 0);
    const totalRejected = stats.reduce((acc, s) => acc + s.rejected_signals, 0);
    const avgSharpe = stats.length > 0 ? stats.reduce((acc, s) => acc + s.avg_sharpe, 0) / stats.length : 0;
    const avgWinRate = stats.length > 0 ? stats.reduce((acc, s) => acc + s.avg_win_rate, 0) / stats.length : 0;
    const avgExpectedReturn = stats.length > 0 ? stats.reduce((acc, s) => acc + s.avg_expected_return, 0) / stats.length : 0;
    const rejectionRate = totalSignals > 0 ? (totalRejected / totalSignals) * 100 : 0;

    return {
      total_symbols: totalSymbols,
      total_strategies: totalStrategies,
      total_signals: totalSignals,
      total_approved: totalApproved,
      total_rejected: totalRejected,
      avg_sharpe: avgSharpe,
      avg_win_rate: avgWinRate,
      avg_expected_return: avgExpectedReturn,
      rejection_rate: rejectionRate,
    };
  };

  const selectedStats = selectedSymbol 
    ? data?.stats.find(s => s.symbol === selectedSymbol) 
    : null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error loading validator statistics</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchValidatorStats}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data || data.stats.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-500 mb-2">No validator statistics available</div>
        <p className="text-sm text-gray-400">Start trading to see consensus metrics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consensus Validator Stats</h2>
          <p className="text-sm text-gray-500">Signal filtering and quality metrics by strategy</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedSymbol || ''}
            onChange={(e) => setSelectedSymbol(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Symbols</option>
            {data.stats.map((stat) => (
              <option key={stat.symbol} value={stat.symbol}>
                {stat.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Signals"
          value={data.summary.total_signals}
          subtitle={`${data.summary.total_symbols} symbols`}
          color="blue"
        />
        <SummaryCard
          title="Approved"
          value={data.summary.total_approved}
          subtitle={`${(100 - data.summary.rejection_rate).toFixed(1)}% pass rate`}
          color="green"
        />
        <SummaryCard
          title="Rejected"
          value={data.summary.total_rejected}
          subtitle={`${data.summary.rejection_rate.toFixed(1)}% rejection rate`}
          color="red"
        />
        <SummaryCard
          title="Avg Sharpe"
          value={data.summary.avg_sharpe.toFixed(2)}
          subtitle="Risk-adjusted return"
          color="purple"
        />
      </div>

      {/* Market Status Alert */}
      <MarketStatusAlert stats={data.stats} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <MetricCard
              label="Win Rate"
              value={`${data.summary.avg_win_rate.toFixed(1)}%`}
              icon="📈"
              trend={data.summary.avg_win_rate >= 50 ? 'up' : 'down'}
            />
            <MetricCard
              label="Expected Return"
              value={`${data.summary.avg_expected_return.toFixed(2)}%`}
              icon="💰"
              trend={data.summary.avg_expected_return > 0 ? 'up' : 'down'}
            />
            <MetricCard
              label="Sharpe Ratio"
              value={data.summary.avg_sharpe.toFixed(2)}
              icon="📊"
              trend={data.summary.avg_sharpe >= 1 ? 'up' : 'down'}
            />
          </div>
        </div>

        {/* Signal Distribution - Donut Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Signal Consensus</h3>
          <DonutChart 
            approved={data.summary.total_approved} 
            rejected={data.summary.total_rejected} 
          />
        </div>

        {/* Risk Heatmap */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Risk Heatmap</h3>
          <RiskHeatmap stats={data.stats} />
        </div>
      </div>

      {/* Detailed Stats by Symbol/Strategy */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Detailed Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strategy</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Approved</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rejected</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sharpe</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Win Rate</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">EV %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(selectedSymbol ? data.stats.filter(s => s.symbol === selectedSymbol) : data.stats).map((stat, idx) => (
                <tr key={`${stat.symbol}-${stat.strategy_id}-${idx}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{stat.symbol}</span>
                    <span className="ml-2 text-xs text-gray-500">{stat.timeframe}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {stat.strategy_id}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {stat.total_signals}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {stat.approved_signals}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {stat.rejected_signals}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className={stat.avg_sharpe >= 1 ? 'text-green-600' : 'text-yellow-600'}>
                      {stat.avg_sharpe.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {stat.avg_win_rate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className={stat.avg_expected_return > 0 ? 'text-green-600' : 'text-red-600'}>
                      {stat.avg_expected_return > 0 ? '+' : ''}{stat.avg_expected_return.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Reasons Analysis */}
      <RejectionReasonsAnalysis stats={selectedSymbol ? data.stats.filter(s => s.symbol === selectedSymbol) : data.stats} />

      {/* Consensus Health Indicator */}
      <ConsensusHealthIndicator summary={data.summary} />
    </div>
  );
}

// Sub-components

function SummaryCard({ title, value, subtitle, color }: { 
  title: string; 
  value: string | number; 
  subtitle: string;
  color: 'blue' | 'green' | 'red' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium opacity-80">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-xs mt-1 opacity-70">{subtitle}</p>
    </div>
  );
}

function MetricCard({ label, value, icon, trend }: {
  label: string;
  value: string;
  icon: string;
  trend: 'up' | 'down';
}) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? '↑' : '↓'} {label}
      </div>
    </div>
  );
}

function SignalDistributionChart({ stats }: { stats: ValidatorStatsItem }) {
  const total = stats.signal_distribution.BUY + stats.signal_distribution.SELL;
  const buyPercent = total > 0 ? (stats.signal_distribution.BUY / total) * 100 : 0;
  const sellPercent = total > 0 ? (stats.signal_distribution.SELL / total) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">BUY Signals</span>
        <span className="font-medium text-green-600">{stats.signal_distribution.BUY} ({buyPercent.toFixed(1)}%)</span>
      </div>
      <div className="h-8 bg-gray-100 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${buyPercent}%` }}
        />
        <div 
          className="h-full bg-red-500 transition-all duration-500"
          style={{ width: `${sellPercent}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">SELL Signals</span>
        <span className="font-medium text-red-600">{stats.signal_distribution.SELL} ({sellPercent.toFixed(1)}%)</span>
      </div>
      
      {/* Bias Indicator */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-500 mb-1">Market Bias</div>
        <div className="flex items-center gap-2">
          {buyPercent > sellPercent + 20 && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
              ↑ Bullish
            </span>
          )}
          {sellPercent > buyPercent + 20 && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
              ↓ Bearish
            </span>
          )}
          {Math.abs(buyPercent - sellPercent) <= 20 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded">
              ↔ Neutral
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function RejectionReasonsAnalysis({ stats }: { stats: ValidatorStatsItem[] }) {
  // Aggregate rejection reasons across all stats
  const aggregatedReasons: Record<string, number> = {};
  
  stats.forEach(stat => {
    Object.entries(stat.rejection_reasons).forEach(([reason, count]) => {
      aggregatedReasons[reason] = (aggregatedReasons[reason] || 0) + count;
    });
  });

  const sortedReasons = Object.entries(aggregatedReasons)
    .sort(([, a], [, b]) => b - a);

  const totalRejections = sortedReasons.reduce((acc, [, count]) => acc + count, 0);

  if (sortedReasons.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Rejection Analysis</h3>
      <p className="text-sm text-gray-500 mb-4">
        Why the Validator Agent is protecting your account
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedReasons.slice(0, 6).map(([reason, count]) => {
          const percentage = totalRejections > 0 ? (count / totalRejections) * 100 : 0;
          
          // Parse reason to get category
          const category = reason.split(':')[0].replace(/_/g, ' ');
          
          return (
            <div key={reason} className="p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-800 capitalize">{category}</span>
                <span className="text-lg font-bold text-red-600">{count}</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-red-600">{reason.split(':')[1]?.trim() || ''}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConsensusHealthIndicator({ summary }: { summary: ValidatorStatsData['summary'] }) {
  // Calculate health score based on various metrics
  let healthScore = 0;
  let healthLabel = '';
  let healthColor = '';

  if (summary.avg_sharpe >= 1.5 && summary.avg_win_rate >= 55) {
    healthScore = 100;
    healthLabel = 'Excellent';
    healthColor = 'green';
  } else if (summary.avg_sharpe >= 1 && summary.avg_win_rate >= 50) {
    healthScore = 75;
    healthLabel = 'Good';
    healthColor = 'blue';
  } else if (summary.avg_sharpe >= 0.5) {
    healthScore = 50;
    healthLabel = 'Fair';
    healthColor = 'yellow';
  } else {
    healthScore = 25;
    healthLabel = 'Poor';
    healthColor = 'red';
  }

  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">Consensus Health</h3>
          <p className="text-sm text-gray-500">Overall validator performance assessment</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${healthScore * 2.51} 251`}
                className={colorClasses[healthColor as keyof typeof colorClasses]}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{healthScore}</span>
            </div>
          </div>
          
          <div>
            <div className={`text-2xl font-bold text-${healthColor}-600`}>{healthLabel}</div>
            <div className="text-sm text-gray-500 mt-1">
              {summary.rejection_rate > 50 
                ? 'High protection - aggressive filtering'
                : summary.rejection_rate > 30
                ? 'Moderate protection active'
                : 'Low protection - market favorable'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Donut Chart for Approved vs Rejected Signals
function DonutChart({ approved, rejected }: { approved: number; rejected: number }) {
  const total = approved + rejected;
  const approvedPercent = total > 0 ? (approved / total) * 100 : 0;
  const rejectedPercent = total > 0 ? (rejected / total) * 100 : 0;
  
  const circumference = 2 * Math.PI * 40;
  const approvedDash = (approvedPercent / 100) * circumference;
  const rejectedDash = (rejectedPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r="40"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200"
          />
          {/* Approved - Green */}
          <circle
            cx="70"
            cy="70"
            r="40"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${approvedDash} ${circumference}`}
            className="text-green-500 transition-all duration-500"
            strokeLinecap="round"
          />
          {/* Rejected - Red */}
          <circle
            cx="70"
            cy="70"
            r="40"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${rejectedDash} ${circumference}`}
            className="text-red-500 transition-all duration-500"
            strokeLinecap="round"
            strokeDashoffset={`-${approvedDash}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{total}</span>
          <span className="text-xs text-gray-500">Total</span>
        </div>
      </div>
      
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">
            Approved: <strong>{approved}</strong> ({approvedPercent.toFixed(1)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-600">
            Rejected: <strong>{rejected}</strong> ({rejectedPercent.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

// Risk Heatmap Component
function RiskHeatmap({ stats }: { stats: ValidatorStatsItem[] }) {
  const getRiskColor = (riskScore?: number) => {
    if (riskScore === undefined || riskScore === null) return 'bg-gray-100';
    if (riskScore <= 30) return 'bg-green-500';
    if (riskScore <= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRiskLabel = (riskScore?: number) => {
    if (riskScore === undefined || riskScore === null) return 'N/A';
    if (riskScore <= 30) return 'Low Risk';
    if (riskScore <= 70) return 'Moderate';
    return 'High Risk';
  };

  const getRiskTextColor = (riskScore?: number) => {
    if (riskScore === undefined || riskScore === null) return 'text-gray-600';
    if (riskScore <= 30) return 'text-green-700';
    if (riskScore <= 70) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Risk Heatmap</h3>
      <p className="text-sm text-gray-500 mb-4">
        Color-coded risk scores: <span className="text-green-600">● Low (0-30)</span> | 
        <span className="text-yellow-600"> ● Moderate (31-70)</span> | 
        <span className="text-red-600"> ● High/Manual (71-100)</span>
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {stats.slice(0, 12).map((stat, idx) => (
          <div 
            key={`${stat.symbol}-${idx}`} 
            className={`p-3 rounded-lg border ${getRiskColor(stat.risk_score)} bg-opacity-20`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-900 text-sm">{stat.symbol}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(stat.risk_score)} text-white`}>
                {stat.risk_score ?? '-'}
              </span>
            </div>
            <div className={`text-xs ${getRiskTextColor(stat.risk_score)}`}>
              {getRiskLabel(stat.risk_score)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Market Status Alert Component
function MarketStatusAlert({ stats }: { stats: ValidatorStatsItem[] }) {
  // Calculate HIGH_VOLATILITY rejections
  let volatilityRejections = 0;
  stats.forEach(stat => {
    Object.entries(stat.rejection_reasons).forEach(([reason, count]) => {
      if (reason.toUpperCase().includes('HIGH_VOLATILITY') || reason.toUpperCase().includes('VOLATILITY')) {
        volatilityRejections += count;
      }
    });
  });

  const totalSignals = stats.reduce((acc, s) => acc + s.total_signals, 0);
  const volatilityRate = totalSignals > 0 ? (volatilityRejections / totalSignals) * 100 : 0;

  const getStatus = () => {
    if (volatilityRate > 30) return { level: 'high', color: 'red', label: 'High Volatility' };
    if (volatilityRate > 15) return { level: 'moderate', color: 'yellow', label: 'Elevated Volatility' };
    if (volatilityRate > 5) return { level: 'low', color: 'green', label: 'Normal Volatility' };
    return { level: 'calm', color: 'blue', label: 'Calm Market' };
  };

  const status = getStatus();
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[status.color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full bg-${status.color}-500`}></div>
          <div>
            <span className="font-semibold">Market Status: {status.label}</span>
            <p className="text-sm opacity-80">
              {volatilityRejections} signals rejected due to volatility ({volatilityRate.toFixed(1)}%)
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold text-${status.color}-600`}>
            {status.level === 'high' ? '⚠️' : status.level === 'moderate' ? '⚡' : status.level === 'low' ? '✓' : '🟢'}
          </span>
        </div>
      </div>
    </div>
  );
}
