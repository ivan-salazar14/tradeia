'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase-singleton';
console.log('[BACKTEST-PAGE] ===== IMPORTING SUPABASE SINGLETON =====');
import { format } from 'date-fns';

interface Strategy {
  id: string;
  name: string;
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
  const [resolvedParams, setResolvedParams] = useState<{ id?: string } | null>(null);
  
  // Resolve params promise
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const [formData, setFormData] = useState({
    symbol: '',
    timeframe: '4h',
    start_date: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
    strategy: '',
    initial_balance: '10000',
    risk_per_trade: '1',
  });
  
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tradesPerPage] = useState(10); // Number of trades per page
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
  const [supabaseReady, setSupabaseReady] = useState(false);

  // Fetch available strategies when component mounts
  useEffect(() => {
    console.log('[BACKTEST-PAGE] ===== COMPONENT MOUNT - FETCHING STRATEGIES =====');

    const fetchStrategies = async () => {
      console.log('[BACKTEST-PAGE] Getting Supabase client from singleton...');

      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) {
        console.error('[BACKTEST-PAGE] Failed to get Supabase client from singleton');
        setError('Failed to initialize Supabase client');
        setLoading(false);
        return;
      }

      console.log('[BACKTEST-PAGE] Supabase client obtained, getting session...');

      try {
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

        console.log('[BACKTEST-PAGE] Session check result:');
        console.log('[BACKTEST-PAGE] - Session error:', sessionError);
        console.log('[BACKTEST-PAGE] - Session exists:', !!session);
        console.log('[BACKTEST-PAGE] - Access token:', session?.access_token ? 'Present' : 'NULL');

        if (sessionError) {
          console.error('[BACKTEST-PAGE] Session error details:', sessionError);
        }

        if (sessionError || !session) {
          console.log('[BACKTEST-PAGE] No valid session found, redirecting to login');
          router.push('/login');
          return;
        }

        console.log('[BACKTEST-PAGE] Session validated, proceeding with strategies fetch');
        
        const response = await fetch('/api/strategies', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'x-user-id': session.user?.id || ''
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch strategies');
        }
        
        const { strategies: fetchedStrategies } = await response.json();
        setStrategies(fetchedStrategies || []);
        
        // Set default strategy if available
        if (fetchedStrategies?.length > 0) {
          setFormData(prev => ({
            ...prev,
            strategy: fetchedStrategies[0].id
          }));
        }
      } catch (error) {
        console.error('Error fetching strategies:', error);
        setError('Failed to load trading strategies');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStrategies();
  }, []);
  
  // Check if Supabase client is available when component mounts
  useEffect(() => {
    console.log('[BACKTEST-PAGE] ===== CHECKING SUPABASE CLIENT AVAILABILITY =====');

    const supabaseClient = getSupabaseClient();
    console.log('[BACKTEST-PAGE] Supabase client from singleton:', supabaseClient ? 'Available' : 'NULL');

    if (supabaseClient) {
      console.log('[BACKTEST-PAGE] Supabase client ready, setting state');
      setSupabaseReady(true);
      setLoading(false);
    } else {
      console.error('[BACKTEST-PAGE] Supabase client not available from singleton');
      setError('Error initializing Supabase client. Please check your environment variables.');
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Ensure we have a clean URL without undefined segments
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.endsWith('undefined')) {
      router.replace('/dashboard/backtest');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabaseReady) {
      setError('Supabase is not ready. Please try again later.');
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingMessage('Preparing backtest request...');
    setIsLongRunning(false);
    
    try {
      // Get Supabase client from singleton
      console.log('[BACKTEST-PAGE] Getting Supabase client for backtest...');
      const supabaseClient = getSupabaseClient();

      if (!supabaseClient) {
        throw new Error('Supabase client not available');
      }

      console.log('[BACKTEST-PAGE] Getting session from Supabase client...');
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const token = sessionData.session?.access_token;

      console.log('[BACKTEST-PAGE] Session data:', sessionData.session ? 'Present' : 'NULL');
      console.log('[BACKTEST-PAGE] Token:', token ? 'Present' : 'NULL/MISSING');

      if (!token) {
        console.error('[BACKTEST-PAGE] No token found, redirecting to login');
        router.push('/login');
        return;
      }

      console.log('[BACKTEST-PAGE] Token obtained successfully');

      // Format dates for the external API
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);

      // Convert dates to format matching curl example: "2024-01-01T00:00:00"
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}T00:00:00`;
      };

      // Construct the request body with correct parameter names
      const requestBody = {
        timeframe: formData.timeframe,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        strategy_id: formData.strategy,
        initial_balance: formData.initial_balance,
        risk_per_trade: formData.risk_per_trade,
        symbol: formData.symbol || '' // Include symbol even if empty
      };

      setLoadingMessage('Sending request to backtest service...');

      // Use our proxy endpoint to avoid CORS issues
      const response = await fetch('/api/backtest/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          ...requestBody,
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
        })
      });

      console.log('[BACKTEST-PAGE] API response status:', response.status);
      console.log('[BACKTEST-PAGE] API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[BACKTEST-PAGE] API error response:', errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }

        throw new Error(errorData.error || 'Failed to run backtest');
      }

      setLoadingMessage('Processing backtest results...');

      const data = await response.json();
      console.log('[BACKTEST-PAGE] API success response received');
      console.log('[BACKTEST-PAGE] Response data structure:', Object.keys(data));
      console.log('[BACKTEST-PAGE] Response data:', JSON.stringify(data, null, 2));

      // Check if this is fallback data
      if (data._fallback) {
        console.warn('[BACKTEST-PAGE] Received fallback data:', data._message);
        setError(`Warning: ${data._message || 'Using sample data due to service unavailability'}`);
      }

      console.log('[BACKTEST-PAGE] Setting result data...');
      console.log('[BACKTEST-PAGE] initial_balance:', data.initial_balance);
      console.log('[BACKTEST-PAGE] final_balance:', data.final_balance);
      console.log('[BACKTEST-PAGE] trades:', data.trades ? data.trades.length : 'undefined');

      setResult(data);
      console.log('[BACKTEST-PAGE] Result state set successfully');
    } catch (err) {
      console.error('Backtest error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while running the backtest');
    } finally {
      setLoading(false);
      setLoadingMessage('Initializing...');
      setIsLongRunning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Backtesting</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Backtest Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Backtest Parameters</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Symbol
                </label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  placeholder="Leave empty for all symbols"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Strategy
                </label>
                <select
                  name="strategy"
                  value={formData.strategy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                  disabled={loading || strategies.length === 0}
                >
                  {loading ? (
                    <option value="">Loading strategies...</option>
                  ) : strategies.length > 0 ? (
                    strategies.map((strategy) => (
                      <option key={strategy.id} value={strategy.id}>
                        {strategy.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No strategies available</option>
                  )}
                </select>
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
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col justify-center items-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{loadingMessage}</p>
                {isLongRunning && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                    This is taking longer than expected. The backtest service may be processing a large dataset...
                  </p>
                )}
              </div>
            </div>
          )}

          {(() => {
            console.log('[BACKTEST-PAGE] Render check - result exists:', !!result);
            console.log('[BACKTEST-PAGE] Render check - result.initial_balance:', result?.initial_balance);
            console.log('[BACKTEST-PAGE] Render check - result has trades:', result?.trades ? result.trades.length : 'no trades');
            const hasValidData = result && (result.initial_balance !== undefined || (result.trades && result.trades.length > 0));
            console.log('[BACKTEST-PAGE] Render check - condition met:', hasValidData);
            return hasValidData;
          })() && result && (
            <div className="space-y-6">
              {/* Debug Info - Remove this after debugging */}
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Debug Info (Remove after fixing)</h3>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-32">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
              {/* Fallback Warning */}
              {result._fallback && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        <strong>Sample Data:</strong> {result._message || 'The backtest service is currently unavailable. Showing sample results for demonstration purposes.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Backtest Results {result._fallback && '(Sample Data)'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Initial Balance</p>
                    <p className="text-2xl font-semibold">${(result.initial_balance || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Final Balance</p>
                    <p className={`text-2xl font-semibold ${
                      (result.final_balance || 0) >= (result.initial_balance || 0) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      ${(result.final_balance || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Return</p>
                    <p className={`text-2xl font-semibold ${
                      (result.total_return_pct || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {(result.total_return_pct || 0) >= 0 ? '+' : ''}{(result.total_return_pct || 0).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Trades Table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Trades ({processedTrades.length})</h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div>
                        <select 
                          value={filters.direction || ''}
                          onChange={(e) => setFilters({...filters, direction: e.target.value as 'BUY' | 'SELL' || undefined})}
                          className="w-full sm:w-auto px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">All Directions</option>
                          <option value="BUY">Buy</option>
                          <option value="SELL">Sell</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="number"
                            placeholder="Min %"
                            value={filters.minProfit ?? ''}
                            onChange={(e) => setFilters({...filters, minProfit: e.target.value ? Number(e.target.value) : undefined})}
                            className="w-full sm:w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                          <span className="text-sm whitespace-nowrap">to</span>
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
                  {processedTrades.length > tradesPerPage && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Showing {Math.min((currentPage - 1) * tradesPerPage + 1, processedTrades.length)} to {Math.min(currentPage * tradesPerPage, processedTrades.length)} of {processedTrades.length} results
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(processedTrades.length / tradesPerPage)))}
                          disabled={currentPage >= Math.ceil(processedTrades.length / tradesPerPage)}
                          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  {processedTrades.length > 0 && (
                    <div className="overflow-x-auto -mx-4 sm:mx-0 mt-4">
                      <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr className="cursor-pointer">
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                  onClick={() => handleSort('symbol')}
                                >
                                  <div className="flex items-center">
                                    Symbol
                                    {sortConfig.key === 'symbol' && (
                                      <span className="ml-1">
                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                      </span>
                                    )}
                                  </div>
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                  onClick={() => handleSort('entry_time')}
                                >
                                  <div className="flex items-center">
                                    Entry Time
                                    {sortConfig.key === 'entry_time' && (
                                      <span className="ml-1">
                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                      </span>
                                    )}
                                  </div>
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-600"
                                  onClick={() => handleSort('direction')}
                                >
                                  <div className="flex items-center">
                                    Direction
                                    {sortConfig.key === 'direction' && (
                                      <span className="ml-1">
                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                      </span>
                                    )}
                                  </div>
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-600"
                                  onClick={() => handleSort('entry_price')}
                                >
                                  <div className="flex items-center">
                                    Entry Price
                                    {sortConfig.key === 'entry_price' && (
                                      <span className="ml-1">
                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                      </span>
                                    )}
                                  </div>
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-600"
                                  onClick={() => handleSort('exit_price')}
                                >
                                  <div className="flex items-center">
                                    Exit Price
                                    {sortConfig.key === 'exit_price' && (
                                      <span className="ml-1">
                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                      </span>
                                    )}
                                  </div>
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-600"
                                  onClick={() => handleSort('profit_pct')}
                                >
                                  <div className="flex items-center">
                                    P/L (%)
                                    {sortConfig.key === 'profit_pct' && (
                                      <span className="ml-1">
                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                      </span>
                                    )}
                                  </div>
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                Balance After
                                </th>
                                </tr>
                                </thead>
                                <tbody>
                                  {processedTrades
                                    .slice(
                                      (currentPage - 1) * tradesPerPage,
                                      currentPage * tradesPerPage
                                    )
                                    .map((trade, index) => (
                                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                          {trade.symbol || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 break-words max-w-[150px] sm:max-w-none">
                                          {trade.entry_time ? new Date(trade.entry_time).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            trade.direction === 'BUY'
                                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                          }`}>
                                            {trade.direction || 'N/A'}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                          {(trade.entry_price || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                          {(trade.exit_price || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </td>
                                        <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                                          (trade.profit_pct || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                          {(trade.profit_pct || 0) >= 0 ? '+' : ''}{(trade.profit_pct || 0).toFixed(2)}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                          ${(trade.balance_after || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
