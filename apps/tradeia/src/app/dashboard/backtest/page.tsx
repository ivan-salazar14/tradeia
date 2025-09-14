'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/auth-context';

interface Strategy {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface Trade {
  symbol?: string;
  entry_time: string;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  direction: 'BUY' | 'SELL';
  exit_time: string;
  exit_price: number;
  exit_reason: string;
  reason: string;
  profit_pct: number;
  profit: number;
  balance_after: number;
  position_notional?: number;
  risk_fraction?: number;
  opened_at_candle_index?: number;
  exit_type?: string;
  duration_hours?: number;
}

interface BacktestResult {
  trades: Trade[];
  initial_balance: number;
  final_balance: number;
  total_return: number;
  total_return_pct: number;
  _fallback?: boolean;
  _message?: string;
}

interface PageProps {
  params: Promise<{ id?: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function BacktestPage({ params }: PageProps) {
  const { session } = useAuth();
  const [resolvedParams, setResolvedParams] = useState<{ id?: string } | null>(null);
  
  // Resolve params promise
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const [formData, setFormData] = useState({
    symbol: [] as string[],
    timeframe: '4h',
    start_date: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
    strategy: '',
    initial_balance: '10000',
    risk_per_trade: '1',
  });
  
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [strategiesLoading, setStrategiesLoading] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tradesPerPage, setTradesPerPage] = useState(25);
  const tradesPerPageOptions = [10, 25, 50, 100];
  const [sortConfig, setSortConfig] = useState<{ key: keyof Trade; direction: 'asc' | 'desc' }>({
    key: 'entry_time' as keyof Trade,
    direction: 'desc'
  });
  const [filters, setFilters] = useState<{
    direction?: 'BUY' | 'SELL';
    minProfit?: number;
    maxProfit?: number;
  }>({});
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Initializing...');
  const [isLongRunning, setIsLongRunning] = useState(false);

  // Show warning for long-running requests
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (loading) {
      timeoutId = setTimeout(() => {
        setIsLongRunning(true);
      }, 10000); // Show warning after 10 seconds
    } else {
      setIsLongRunning(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading]);
  
  // Handle sorting
  const handleSort = (key: keyof Trade) => {
    setSortConfig(prev => ({
      key: key as keyof Trade,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Apply sorting and filtering to trades
  const getProcessedTrades = () => {
    if (!result || !result.trades || !Array.isArray(result.trades)) return [];

    let processedTrades = [...result.trades];
    
    // Apply filters
    if (filters.direction) {
      processedTrades = processedTrades.filter(trade => trade.direction === filters.direction);
    }
    
    if (filters.minProfit !== undefined) {
      processedTrades = processedTrades.filter(trade => trade.profit_pct >= (filters.minProfit || 0));
    }
    
    if (filters.maxProfit !== undefined) {
      processedTrades = processedTrades.filter(trade => trade.profit_pct <= (filters.maxProfit || 0));
    }
    
    // Apply sorting
    return processedTrades.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle undefined/null values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };
  
  const processedTrades = getProcessedTrades();
  const router = useRouter();

  // Pagination calculations
  const totalPages = Math.ceil(processedTrades.length / tradesPerPage);
  const startIndex = (currentPage - 1) * tradesPerPage;
  const endIndex = startIndex + tradesPerPage;
  const currentTrades = processedTrades.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [result]); // Reset when new results come in

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleTradesPerPageChange = (newPerPage: number) => {
    setTradesPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Load mock strategies immediately without API call
  useEffect(() => {
    console.log('[BACKTEST-PAGE] ===== LOADING MOCK STRATEGIES =====');
    setStrategiesLoading(true);

    // Load strategies immediately without delay
    const mockStrategies = [
      {
        id: 'conservative',
        name: 'Conservative Strategy',
        description: 'Low-risk strategy with basic technical indicators like SMA and RSI'
      },
      {
        id: 'moderate',
        name: 'Moderate Strategy',
        description: 'Balanced risk strategy with multiple indicators including MACD'
      },
      {
        id: 'sqzmom_adx',
        name: 'ADX Squeeze Momentum',
        description: 'Strategy using ADX and Squeeze Momentum indicators for trend confirmation'
      },
      {
        id: 'aggressive',
        name: 'Aggressive Strategy',
        description: 'High-risk strategy for experienced traders with Bollinger Bands'
      },
      {
        id: 'scalping',
        name: 'Scalping Strategy',
        description: 'Fast-paced strategy for quick profits using EMA and Stochastic'
      },
      {
        id: 'swing',
        name: 'Swing Trading',
        description: 'Medium-term strategy for trend following with Volume analysis'
      }
    ];

    console.log('[BACKTEST-PAGE] ✅ Mock strategies loaded successfully:', mockStrategies.length);
    console.log('[BACKTEST-PAGE] Available strategies:', mockStrategies.map(s => `${s.id}: ${s.name}`));

    setStrategies(mockStrategies);
    setStrategiesLoading(false);

    // Set default strategy to moderate
    const defaultStrategy = 'moderate';
    setFormData(prev => ({
      ...prev,
      strategy: defaultStrategy
    }));

    console.log('[BACKTEST-PAGE] ✅ Default strategy set to:', defaultStrategy);
    console.log('[BACKTEST-PAGE] ✅ Strategy dropdown should now show:', mockStrategies.find(s => s.id === defaultStrategy)?.name);
  }, []);

  // Set loading to false after strategies are loaded
  useEffect(() => {
    if (strategies.length > 0 && !strategiesLoading) {
      setLoading(false);
    }
  }, [strategies, strategiesLoading]);
  

  // Debug logging for strategy options
  useEffect(() => {
    console.log('[BACKTEST-PAGE] Strategy options updated:', strategies.length, 'strategies');
    console.log('[BACKTEST-PAGE] Strategies loading:', strategiesLoading);
    console.log('[BACKTEST-PAGE] Loading state:', loading);
    if (strategies.length > 0) {
      console.log('[BACKTEST-PAGE] Available strategies:', strategies.map(s => `${s.id}: ${s.name}`));
      console.log(':', formData.strategy);
    } else {
      console.log('[BACKTEST-PAGE] ⚠️ No strategies available - this will show "No strategies available" in dropdown');
    }
  }, [strategies, strategiesLoading, loading, formData.strategy]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'symbol') {
      const selectElement = e.target as HTMLSelectElement;
      const selectedValues = Array.from(selectElement.selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedValues
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Ensure we have a clean URL without undefined segments
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.endsWith('undefined')) {
      router.replace('/dashboard/backtest');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setLoadingMessage('Preparing backtest request...');
    setIsLongRunning(false);

    try {
      setLoadingMessage('Fetching signals from API...');

      // Build API request parameters
      const requestBody = {
        timeframe: formData.timeframe,
        start_date: `${formData.start_date}T00:00:00`,
        end_date: `${formData.end_date}T23:59:59`,
        initial_balance: parseFloat(formData.initial_balance),
        risk_per_trade: parseFloat(formData.risk_per_trade),
        symbol: formData.symbol.length > 0 ? formData.symbol[0] : undefined, // Use first symbol if multiple selected
        strategy_id: formData.strategy || undefined
      };

      // Build headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'identity',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      };

      // Add Authorization header if user is authenticated
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      console.log('[BACKTEST] Making POST request to /api/signals/generate');
      console.log('[BACKTEST] Request body:', requestBody);

      // Make API call to signals endpoint
      const response = await fetch('/api/signals/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        mode: 'cors',
        credentials: 'same-origin'
      });

      if (!response.ok) {
        let errorText: string;
        try {
          errorText = await response.text();
        } catch (decodeError) {
          console.warn('[BACKTEST] Failed to decode error response:', decodeError);
          errorText = `HTTP ${response.status} - Content decoding failed`;
        }
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      let json: any;
      try {
        json = await response.json();
      } catch (decodeError) {
        console.warn('[BACKTEST] Failed to decode JSON response:', decodeError);
        throw new Error('Failed to decode response JSON');
      }

      console.log('[BACKTEST] API response received:', json);

      // Process the signals into backtest format
      const signals = json.signals || [];
      const initialBalance = parseFloat(formData.initial_balance);
      const riskPerTrade = parseFloat(formData.risk_per_trade);

      // Convert signals to trades format
      const trades: Trade[] = [];
      let currentBalance = initialBalance;

      for (const signal of signals) {
        if (!signal.entry || !signal.stopLoss) continue;

        // Calculate position size based on risk
        const riskAmount = (currentBalance * riskPerTrade) / 100;
        const riskPerUnit = Math.abs(signal.entry - signal.stopLoss);
        const positionSize = riskAmount / riskPerUnit;

        // Determine exit based on take profit or stop loss
        let exitPrice = signal.entry;
        let exitReason = 'Signal closed';
        let profit = 0;

        if (signal.direction === 'BUY') {
          if (signal.tp1 && signal.entry < signal.tp1) {
            exitPrice = signal.tp1;
            exitReason = 'Take Profit';
          } else if (signal.stopLoss && signal.entry > signal.stopLoss) {
            exitPrice = signal.stopLoss;
            exitReason = 'Stop Loss';
          }
        } else if (signal.direction === 'SELL') {
          if (signal.tp1 && signal.entry > signal.tp1) {
            exitPrice = signal.tp1;
            exitReason = 'Take Profit';
          } else if (signal.stopLoss && signal.entry < signal.stopLoss) {
            exitPrice = signal.stopLoss;
            exitReason = 'Stop Loss';
          }
        }

        profit = positionSize * (exitPrice - signal.entry);
        const profitPct = (profit / (positionSize * signal.entry)) * 100;

        const trade: Trade = {
          symbol: signal.symbol || 'UNKNOWN',
          entry_time: signal.timestamp || new Date().toISOString(),
          entry_price: signal.entry,
          stop_loss: signal.stopLoss,
          take_profit: signal.tp1,
          direction: signal.direction === 'BUY' ? 'BUY' : 'SELL',
          exit_time: signal.timestamp || new Date().toISOString(), // Use same time for simplicity
          exit_price: exitPrice,
          exit_reason: exitReason,
          reason: exitReason,
          profit_pct: profitPct,
          profit: profit,
          balance_after: currentBalance + profit,
          position_notional: positionSize * signal.entry,
          risk_fraction: riskPerTrade / 100,
          duration_hours: signal.signal_age_hours || 1
        };

        trades.push(trade);
        currentBalance += profit;
      }

      // Calculate totals
      const finalBalance = currentBalance;
      const totalReturn = finalBalance - initialBalance;
      const totalReturnPct = initialBalance > 0 ? (totalReturn / initialBalance) * 100 : 0;

      const backtestResult: BacktestResult = {
        trades: trades,
        initial_balance: initialBalance,
        final_balance: finalBalance,
        total_return: totalReturn,
        total_return_pct: totalReturnPct,
        _fallback: json._mock || false,
        _message: json._message || undefined
      };

      setResult(backtestResult);
      setLoadingMessage('Backtest completed successfully');

    } catch (err) {
      console.error('Backtest error:', err);

      // Fallback to mock data if API fails
      console.log('[BACKTEST] API failed, using mock data fallback');
      const initialBalance = parseFloat(formData.initial_balance);
      const riskPerTrade = parseFloat(formData.risk_per_trade);

      const mockTrades: Trade[] = [
        {
          symbol: 'BTC/USDT',
          entry_time: new Date().toISOString(),
          entry_price: 45000,
          stop_loss: 44000,
          take_profit: 46000,
          direction: 'BUY',
          exit_time: new Date().toISOString(),
          exit_price: 45500,
          exit_reason: 'Take Profit',
          reason: 'Target reached',
          profit_pct: 1.11,
          profit: 111.11,
          balance_after: initialBalance + 111.11,
          position_notional: 10000,
          risk_fraction: riskPerTrade / 100,
          duration_hours: 2
        }
      ];

      const mockResult: BacktestResult = {
        trades: mockTrades,
        initial_balance: initialBalance,
        final_balance: initialBalance + 111.11,
        total_return: 111.11,
        total_return_pct: (111.11 / initialBalance) * 100,
        _fallback: true,
        _message: 'API unavailable, showing sample data'
      };

      setResult(mockResult);
      setError(`API Error: ${err instanceof Error ? err.message : 'Unknown error'} - Using mock data`);
    } finally {
      setLoading(false);
      setLoadingMessage('Initializing...');
      setIsLongRunning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Backtesting</h1>
        {strategies.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 000 16zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Mock Mode
            </span>
            <span className="text-sm text-gray-500">
              {strategies.length} strategies loaded
            </span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Backtest Form */}
        <div className="xl:col-span-1 order-2 xl:order-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Backtest Parameters</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Symbol (Hold Ctrl/Cmd to select multiple)
                </label>
                <select
                  name="symbol"
                  multiple
                  value={formData.symbol}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white min-h-[120px]"
                >
                  <option value="BTC/USDT">BTC/USDT</option>
                  <option value="ETH/USDT">ETH/USDT</option>
                  <option value="BNB/USDT">BNB/USDT</option>
                  <option value="ADA/USDT">ADA/USDT</option>
                  <option value="SOL/USDT">SOL/USDT</option>
                  <option value="DOT/USDT">DOT/USDT</option>
                  <option value="LINK/USDT">LINK/USDT</option>
                  <option value="LTC/USDT">LTC/USDT</option>
                  <option value="XRP/USDT">XRP/USDT</option>
                  <option value="DOGE/USDT">DOGE/USDT</option>
                </select>
                {formData.symbol.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Selected: {formData.symbol.join(', ')}
                  </div>
                )}
                {formData.symbol.length === 0 && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    No symbols selected (will test all symbols)
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Timeframe
                </label>
                <select
                  name="timeframe"
                  value={formData.timeframe}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="1m">1 Minute</option>
                  <option value="5m">5 Minutes</option>
                  <option value="15m">15 Minutes</option>
                  <option value="1h">1 Hour</option>
                  <option value="4h">4 Hours</option>
                  <option value="1d">1 Day</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Strategy
                   {strategiesLoading ? (
                     <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                       <svg className="w-3 h-3 mr-1 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                       </svg>
                       Loading...
                     </span>
                   ) : strategies.length > 0 ? (
                     <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                       <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                       </svg>
                       Mock ({strategies.length})
                     </span>
                   ) : (
                     <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                       Error
                     </span>
                   )}
                </label>
                <div className="relative">
                  <select
                    name="strategy"
                    value={formData.strategy}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none bg-no-repeat bg-right bg-[length:1rem] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzY5NzM4NSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')]"
                    required
                    disabled={loading || strategiesLoading}
                  >
                    {strategiesLoading ? (
                      <option value="" disabled>Loading strategies...</option>
                    ) : strategies.length > 0 ? (
                      <>
                        <option value="" disabled>--- Select a Strategy ---</option>
                        {strategies.map((strategy) => (
                          <option key={strategy.id} value={strategy.id}>
                            {strategy.name}
                            {strategy.description && ` - ${strategy.description.slice(0, 40)}${strategy.description.length > 40 ? '...' : ''}`}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option value="" disabled>No strategies available</option>
                    )}
                  </select>

                  {/* Strategy count indicator */}
                  {strategies.length > 0 && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {strategies.length}
                    </div>
                  )}

                  {/* Mobile-friendly info */}
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 md:hidden">
                    {formData.strategy && strategies.find(s => s.id === formData.strategy) && (
                      <div className="flex items-center justify-between">
                        <span>
                          Selected: {strategies.find(s => s.id === formData.strategy)?.name}
                        </span>
                        <span className="text-blue-500">
                          {strategies.length} available
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mobile strategies preview */}
                  {strategies.length > 0 && (
                    <div className="mt-2 md:hidden">
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quick Select ({strategies.length} strategies)
                      </div>
                      <div className="max-h-24 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        {strategies.slice(0, 5).map((strategy) => (
                          <button
                            key={strategy.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, strategy: strategy.id }))}
                            className={`w-full text-left p-2 rounded text-xs transition-colors ${
                              formData.strategy === strategy.id
                                ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-600'
                                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                          >
                            <div className="font-medium truncate">{strategy.name}</div>
                            {strategy.description && (
                              <div className="text-gray-600 dark:text-gray-400 truncate text-xs">
                                {strategy.description}
                              </div>
                            )}
                          </button>
                        ))}
                        {strategies.length > 5 && (
                          <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-1">
                            +{strategies.length - 5} more strategies available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Strategy preview for larger screens */}
                {formData.strategy && strategies.find(s => s.id === formData.strategy) && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md hidden md:block">
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      <strong>{strategies.find(s => s.id === formData.strategy)?.name}</strong>
                      {strategies.find(s => s.id === formData.strategy)?.description && (
                        <div className="mt-1 text-gray-500 dark:text-gray-400">
                          {strategies.find(s => s.id === formData.strategy)?.description}
                        </div>
                      )}
                      {strategies.find(s => s.id === formData.strategy)?.created_at && (
                        <div className="mt-1 text-gray-400 dark:text-gray-500">
                          Created: {new Date(strategies.find(s => s.id === formData.strategy)?.created_at || '').toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Strategies Overview - Responsive Grid */}
                {strategies.length > 0 && (
                  <div className="mt-3 hidden lg:block">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Available Strategies ({strategies.length})
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                      {strategies.map((strategy) => (
                        <div
                          key={strategy.id}
                          onClick={() => setFormData(prev => ({ ...prev, strategy: strategy.id }))}
                          className={`p-2 rounded-md cursor-pointer transition-colors text-xs ${
                            formData.strategy === strategy.id
                              ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-600'
                              : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {strategy.name}
                          </div>
                          {strategy.description && (
                            <div className="text-gray-600 dark:text-gray-400 truncate text-xs mt-1">
                              {strategy.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Initial Balance (USDT)
                </label>
                <input
                  type="number"
                  name="initial_balance"
                  value={formData.initial_balance}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Risk per Trade (%)
                </label>
                <input
                  type="number"
                  name="risk_per_trade"
                  value={formData.risk_per_trade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  min="0.01"
                  max="100"
                  step="0.01"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Running Backtest...</span>
                  </div>
                ) : (
                  'Run Backtest'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="xl:col-span-2 order-1 xl:order-2">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 md:p-4 mb-4 md:mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 md:h-5 md:w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs md:text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col justify-center items-center py-8 md:py-12 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
              <div className="text-center px-4">
                <p className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">{loadingMessage}</p>
                {isLongRunning && (
                  <p className="text-xs md:text-sm text-amber-600 dark:text-amber-400 mt-2 max-w-md">
                    This is taking longer than expected. The backtest service may be processing a large dataset...
                  </p>
                )}
              </div>
            </div>
          )}

          {result && (result.initial_balance !== undefined || (result.trades && result.trades.length > 0)) && (
            <div className="space-y-6">
              {/* Fallback Warning */}
              {result._fallback && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-3 md:p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 md:h-5 md:w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-xs md:text-sm text-amber-700 dark:text-amber-300">
                        <strong>Sample Data:</strong> {result._message || 'The backtest service is currently unavailable. Showing sample results for demonstration purposes.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4">
                  Backtest Results {result._fallback && '(Sample Data)'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Initial Balance</p>
                    <p className="text-xl md:text-2xl font-semibold">${(result.initial_balance || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Final Balance</p>
                    <p className={`text-xl md:text-2xl font-semibold ${
                      (result.final_balance || 0) >= (result.initial_balance || 0) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      ${(result.final_balance || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg sm:col-span-2 lg:col-span-1">
                    <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Total Return</p>
                    <p className={`text-xl md:text-2xl font-semibold ${
                      (result.total_return_pct || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {(result.total_return_pct || 0) >= 0 ? '+' : ''}{(result.total_return_pct || 0).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Trades Table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
                    <h2 className="text-lg font-medium">Trades ({processedTrades.length})</h2>
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                      <div className="w-full sm:w-auto">
                        <select
                          value={filters.direction || ''}
                          onChange={(e) => setFilters({...filters, direction: e.target.value as 'BUY' | 'SELL' || undefined})}
                          className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">All Directions</option>
                          <option value="BUY">Buy</option>
                          <option value="SELL">Sell</option>
                        </select>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="number"
                            placeholder="Min %"
                            value={filters.minProfit ?? ''}
                            onChange={(e) => setFilters({...filters, minProfit: e.target.value ? Number(e.target.value) : undefined})}
                            className="w-full sm:w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                          <span className="text-sm whitespace-nowrap hidden sm:inline">to</span>
                          <span className="text-sm whitespace-nowrap sm:hidden">→</span>
                        </div>
                        <div className="w-full sm:w-auto">
                          <input
                            type="number"
                            placeholder="Max %"
                            value={filters.maxProfit ?? ''}
                            onChange={(e) => setFilters({...filters, maxProfit: e.target.value ? Number(e.target.value) : undefined})}
                            className="w-full sm:w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Table Controls */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        Mostrando {currentTrades.length > 0 ? startIndex + 1 : 0} a {Math.min(endIndex, processedTrades.length)} de {processedTrades.length} operaciones
                      </span>
                      <select
                        value={tradesPerPage}
                        onChange={(e) => handleTradesPerPageChange(Number(e.target.value))}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {tradesPerPageOptions.map(option => (
                          <option key={option} value={option}>{option} por página</option>
                        ))}
                      </select>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Anterior
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                            if (pageNum > totalPages) return null;

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-1.5 border rounded text-sm ${
                                  currentPage === pageNum
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Siguiente
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Trades Table with Scrolling */}
                  <div className="overflow-x-auto overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr className="cursor-pointer">
                          <th
                            scope="col"
                            className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                            onClick={() => handleSort('symbol')}
                          >
                            <div className="flex items-center">
                              <span className="hidden sm:inline">Symbol</span>
                              <span className="sm:hidden">Sym</span>
                              {sortConfig.key === 'symbol' && (
                                <span className="ml-1">
                                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                            onClick={() => handleSort('entry_time')}
                          >
                            <div className="flex items-center">
                              <span className="hidden sm:inline">Entry Time</span>
                              <span className="sm:hidden">Entry</span>
                              {sortConfig.key === 'entry_time' && (
                                <span className="ml-1">
                                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                            onClick={() => handleSort('exit_time')}
                          >
                            <div className="flex items-center">
                              <span className="hidden sm:inline">Exit Time</span>
                              <span className="sm:hidden">Exit</span>
                              {sortConfig.key === 'exit_time' && (
                                <span className="ml-1">
                                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => handleSort('direction')}
                          >
                            <div className="flex items-center">
                              <span className="hidden sm:inline">Direction</span>
                              <span className="sm:hidden">Dir</span>
                              {sortConfig.key === 'direction' && (
                                <span className="ml-1">
                                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => handleSort('entry_price')}
                          >
                            <div className="flex items-center">
                              <span className="hidden sm:inline">Entry Price</span>
                              <span className="sm:hidden">Entry $</span>
                              {sortConfig.key === 'entry_price' && (
                                <span className="ml-1">
                                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => handleSort('exit_price')}
                          >
                            <div className="flex items-center">
                              <span className="hidden sm:inline">Exit Price</span>
                              <span className="sm:hidden">Exit $</span>
                              {sortConfig.key === 'exit_price' && (
                                <span className="ml-1">
                                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => handleSort('profit_pct')}
                          >
                            <div className="flex items-center">
                              <span className="hidden sm:inline">P/L (%)</span>
                              <span className="sm:hidden">P/L</span>
                              {sortConfig.key === 'profit_pct' && (
                                <span className="ml-1">
                                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th scope="col" className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            <span className="hidden sm:inline">Position Size</span>
                            <span className="sm:hidden">Size</span>
                          </th>
                          <th scope="col" className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            <span className="hidden sm:inline">Risk %</span>
                            <span className="sm:hidden">Risk</span>
                          </th>
                          <th scope="col" className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            <span className="hidden sm:inline">Duration (h)</span>
                            <span className="sm:hidden">Hours</span>
                          </th>
                          <th scope="col" className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            <span className="hidden sm:inline">Balance After</span>
                            <span className="sm:hidden">Balance</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTrades.length === 0 && (
                          <tr>
                            <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                              No hay operaciones disponibles para mostrar.
                            </td>
                          </tr>
                        )}
                        {currentTrades.map((trade, index) => (
                          <tr key={`${currentPage}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">
                              {trade.symbol || 'N/A'}
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900 dark:text-gray-100 break-words max-w-[100px] md:max-w-[150px] sm:max-w-none">
                              {trade.entry_time ? new Date(trade.entry_time).toLocaleString() : 'N/A'}
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900 dark:text-gray-100 break-words max-w-[100px] md:max-w-[150px] sm:max-w-none">
                              {trade.exit_time ? new Date(trade.exit_time).toLocaleString() : 'N/A'}
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                              <span className={`px-1 md:px-2 inline-flex text-xs leading-4 md:leading-5 font-semibold rounded-full ${
                                trade.direction === 'BUY'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {trade.direction || 'N/A'}
                              </span>
                            </td>
                            <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 dark:text-gray-100">
                              ${(trade.entry_price || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 dark:text-gray-100">
                              ${(trade.exit_price || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className={`px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm font-medium ${
                              (trade.profit_pct || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {(trade.profit_pct || 0) >= 0 ? '+' : ''}{(trade.profit_pct || 0).toFixed(2)}%
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-900 dark:text-gray-100">
                              {trade.position_notional ? `$${trade.position_notional.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'N/A'}
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-900 dark:text-gray-100">
                              {trade.risk_fraction ? `${(trade.risk_fraction * 100).toFixed(2)}%` : 'N/A'}
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-900 dark:text-gray-100">
                              {trade.duration_hours ? `${trade.duration_hours.toFixed(1)}h` : 'N/A'}
                            </td>
                            <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 dark:text-gray-100">
                              ${(trade.balance_after || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
