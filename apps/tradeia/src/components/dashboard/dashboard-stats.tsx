'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface DashboardStatsData {
  summary: {
    total_signals: number;
    timeframe: string;
    date_range: {
      start: string;
      end: string;
    };
  };
  performance_metrics: {
    buy_percentage: number;
    sell_percentage: number;
    total_buy_signals: number;
    total_sell_signals: number;
  };
  strategy_breakdown: Array<{
    strategy_id: string;
    strategy_name: string;
    signal_count: number;
    percentage: number;
  }>;
  timeframe_breakdown: Array<{
    timeframe: string;
    signal_count: number;
    percentage: number;
  }>;
  symbol_breakdown: Array<{
    symbol: string;
    signal_count: number;
    percentage: number;
  }>;
  recent_activity: Array<{
    id: string;
    symbol: string;
    direction: string;
    timestamp: string;
    strategy_id: string;
  }>;
  signal_quality: {
    avg_signal_age_hours: number;
    signals_last_24h: number;
    signals_last_7d: number;
    signals_last_30d: number;
  };
}

export default function DashboardStats() {
  const { session } = useAuth();
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, [session]);

  const fetchDashboardStats = async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading dashboard statistics: {error}</p>
        <button
          onClick={fetchDashboardStats}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">No dashboard statistics available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Signals</h3>
          <p className="text-3xl font-semibold text-blue-600">{stats.summary.total_signals}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.summary.date_range.start} to {stats.summary.date_range.end}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Buy Signals</h3>
          <p className="text-3xl font-semibold text-green-600">{stats.performance_metrics.total_buy_signals}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.performance_metrics.buy_percentage}% of total
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Sell Signals</h3>
          <p className="text-3xl font-semibold text-red-600">{stats.performance_metrics.total_sell_signals}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.performance_metrics.sell_percentage}% of total
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Avg Signal Age</h3>
          <p className="text-3xl font-semibold text-purple-600">{stats.signal_quality.avg_signal_age_hours}h</p>
          <p className="text-xs text-gray-500 mt-1">
            Last 24h: {stats.signal_quality.signals_last_24h}
          </p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-4">Strategy Breakdown</h3>
          <div className="space-y-3">
            {stats.strategy_breakdown.slice(0, 5).map((strategy) => (
              <div key={strategy.strategy_id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 truncate">{strategy.strategy_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{strategy.signal_count}</span>
                  <span className="text-xs text-gray-500">({strategy.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
            {stats.strategy_breakdown.length === 0 && (
              <p className="text-sm text-gray-500">No strategies found</p>
            )}
          </div>
        </div>

        {/* Symbol Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-4">Top Symbols</h3>
          <div className="space-y-3">
            {stats.symbol_breakdown.slice(0, 5).map((symbol) => (
              <div key={symbol.symbol} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{symbol.symbol}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{symbol.signal_count}</span>
                  <span className="text-xs text-gray-500">({symbol.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
            {stats.symbol_breakdown.length === 0 && (
              <p className="text-sm text-gray-500">No symbols found</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {stats.recent_activity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{activity.symbol}</span>
                  <span className="text-xs text-gray-500">{activity.strategy_id}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs px-2 py-1 rounded ${
                    activity.direction === 'BUY'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {activity.direction}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {stats.recent_activity.length === 0 && (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Timeframe Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-semibold mb-4">Timeframe Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.timeframe_breakdown.map((timeframe) => (
            <div key={timeframe.timeframe} className="text-center">
              <div className="text-2xl font-semibold text-blue-600">{timeframe.signal_count}</div>
              <div className="text-sm text-gray-600">{timeframe.timeframe}</div>
              <div className="text-xs text-gray-500">({timeframe.percentage.toFixed(1)}%)</div>
            </div>
          ))}
          {stats.timeframe_breakdown.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-4">
              No timeframe data available
            </div>
          )}
        </div>
      </div>

      {/* Signal Quality Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-semibold mb-4">Signal Quality Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">{stats.signal_quality.signals_last_24h}</div>
            <div className="text-sm text-gray-600">Last 24h</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-600">{stats.signal_quality.signals_last_7d}</div>
            <div className="text-sm text-gray-600">Last 7 days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-purple-600">{stats.signal_quality.signals_last_30d}</div>
            <div className="text-sm text-gray-600">Last 30 days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-orange-600">{stats.signal_quality.avg_signal_age_hours.toFixed(1)}h</div>
            <div className="text-sm text-gray-600">Avg Age</div>
          </div>
        </div>
      </div>
    </div>
  );
}