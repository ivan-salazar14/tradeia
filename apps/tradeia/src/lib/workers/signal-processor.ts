import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { UnifiedSignal } from '@/lib/signals/types';

interface SignalProcessingTask {
  type: 'calculate_portfolio_metrics' | 'validate_signals' | 'generate_mock_signals';
  data: any;
}

interface SignalProcessingResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Portfolio metrics calculation (CPU intensive)
function calculatePortfolioMetrics(signals: UnifiedSignal[], initialBalance: number, riskPerTrade: number) {
  let totalPositionSize = 0;
  let totalRiskAmount = 0;
  let remainingBalance = initialBalance;
  let totalRewardToRisk = 0;
  let validSignalsCount = 0;

  // Simulate heavy computation
  for (let i = 0; i < signals.length; i++) {
    const signal = signals[i];

    // Skip signals without entry price or stop loss
    if (!signal.entry || !signal.stopLoss) continue;

    // Calculate position size based on risk (simulate complex math)
    const riskAmount = (remainingBalance * riskPerTrade) / 100;
    const riskPerUnit = Math.abs(signal.entry - signal.stopLoss);
    const positionSize = riskAmount / riskPerUnit;

    // Complex calculations to simulate CPU load
    totalPositionSize += positionSize * signal.entry * Math.sin(i) * Math.cos(i);
    totalRiskAmount += riskAmount;

    // Calculate reward to risk ratio
    if (signal.tp1) {
      const reward = Math.abs(signal.tp1 - signal.entry);
      const rewardToRisk = reward / riskPerUnit;
      totalRewardToRisk += rewardToRisk * Math.sqrt(i + 1); // Simulate complexity
      validSignalsCount++;
    }

    // Update remaining balance
    remainingBalance -= riskAmount;

    // Simulate additional processing time
    if (i % 100 === 0) {
      // Small delay to simulate real computation
      const dummy = Math.random();
      for (let j = 0; j < 1000; j++) {
        Math.sqrt(dummy * j);
      }
    }
  }

  const avgRewardToRisk = validSignalsCount > 0 ? totalRewardToRisk / validSignalsCount : 0;

  return {
    total_position_size: totalPositionSize,
    total_risk_amount: totalRiskAmount,
    remaining_balance: Math.max(0, remainingBalance),
    avg_reward_to_risk: avgRewardToRisk,
    processed_signals: signals.length,
    valid_signals: validSignalsCount
  };
}

// Signal validation (can be CPU intensive with large datasets)
function validateSignals(signals: any[]): UnifiedSignal[] {
  const validatedSignals: UnifiedSignal[] = [];

  for (const signal of signals) {
    // Comprehensive validation with complex checks
    const isValid =
      signal.id &&
      typeof signal.id === 'string' &&
      signal.symbol &&
      typeof signal.symbol === 'string' &&
      /^[\w/]+$/.test(signal.symbol) && // Symbol format validation
      signal.timeframe &&
      ['1m', '5m', '15m', '1h', '4h', '1d', '1w'].includes(signal.timeframe) &&
      signal.timestamp &&
      !isNaN(Date.parse(signal.timestamp)) &&
      ['BUY', 'SELL', 'LONG', 'SHORT'].includes(signal.direction) &&
      ['entry', 'exit', 'update'].includes(signal.type);

    if (isValid) {
      // Additional data sanitization and normalization
      const normalizedSignal: UnifiedSignal = {
        id: signal.id,
        symbol: signal.symbol.toUpperCase(),
        timeframe: signal.timeframe,
        timestamp: new Date(signal.timestamp).toISOString(),
        execution_timestamp: signal.execution_timestamp,
        signal_age_hours: signal.signal_age_hours,
        signal_source: signal.signal_source || 'processed',
        type: signal.type,
        direction: signal.direction,
        strategyId: signal.strategyId,
        reason: signal.reason,
        entry: typeof signal.entry === 'number' ? signal.entry : undefined,
        tp1: typeof signal.tp1 === 'number' ? signal.tp1 : undefined,
        tp2: typeof signal.tp2 === 'number' ? signal.tp2 : undefined,
        stopLoss: typeof signal.stopLoss === 'number' ? signal.stopLoss : undefined,
        marketScenario: signal.marketScenario,
        createdAt: signal.createdAt,
        source: signal.source || { provider: 'worker_processed' }
      };

      validatedSignals.push(normalizedSignal);
    }
  }

  return validatedSignals;
}

// Generate mock signals with complex logic
function generateMockSignals(params: any): UnifiedSignal[] {
  const { symbol = 'BTC/USDT', timeframe = '4h', count = 10, activeStrategyIds = ['moderate'] } = params;
  const signals: UnifiedSignal[] = [];

  for (let i = 0; i < count; i++) {
    // Complex mock data generation
    const basePrice = 50000 + (Math.random() - 0.5) * 10000;
    const volatility = Math.random() * 0.05; // 5% max volatility
    const trend = Math.random() > 0.5 ? 1 : -1;

    const entry = basePrice * (1 + trend * volatility * Math.sin(i / count * Math.PI));
    const stopLoss = entry * (1 - trend * volatility * 0.8);
    const tp1 = entry * (1 + trend * volatility * 1.5);
    const tp2 = entry * (1 + trend * volatility * 2.5);

    // Simulate processing time
    const dummy = Math.random();
    for (let j = 0; j < 500; j++) {
      Math.pow(dummy, j % 10);
    }

    signals.push({
      id: `mock-signal-worker-${i + 1}`,
      symbol,
      timeframe,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      execution_timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      signal_age_hours: i,
      signal_source: 'worker_generated',
      type: 'entry' as const,
      direction: trend > 0 ? 'BUY' : 'SELL',
      strategyId: activeStrategyIds[i % activeStrategyIds.length],
      entry,
      tp1,
      tp2,
      stopLoss,
      source: { provider: 'worker_mock' }
    });
  }

  return signals;
}

// Worker thread main logic
if (!isMainThread) {
  parentPort?.on('message', async (task: SignalProcessingTask) => {
    try {
      let result: any;

      switch (task.type) {
        case 'calculate_portfolio_metrics':
          result = calculatePortfolioMetrics(
            task.data.signals,
            task.data.initialBalance,
            task.data.riskPerTrade
          );
          break;

        case 'validate_signals':
          result = validateSignals(task.data.signals);
          break;

        case 'generate_mock_signals':
          result = generateMockSignals(task.data);
          break;

        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }

      const response: SignalProcessingResult = {
        success: true,
        data: result
      };

      parentPort?.postMessage(response);
    } catch (error) {
      const response: SignalProcessingResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      parentPort?.postMessage(response);
    }
  });
}

// Main thread utilities
export class SignalProcessorWorker {
  private worker: Worker | null = null;
  private isProcessing = false;

  constructor() {
    if (isMainThread) {
      this.initializeWorker();
    }
  }

  private initializeWorker() {
    try {
      this.worker = new Worker(__filename);
    } catch (error) {
      console.error('Failed to create signal processor worker:', error);
    }
  }

  async processTask<T = any>(task: SignalProcessingTask): Promise<T> {
    if (!this.worker) {
      throw new Error('Worker not available');
    }

    if (this.isProcessing) {
      throw new Error('Worker is busy processing another task');
    }

    return new Promise<T>((resolve, reject) => {
      this.isProcessing = true;

      const timeout = setTimeout(() => {
        this.isProcessing = false;
        reject(new Error('Worker task timeout'));
      }, 30000); // 30 second timeout

      this.worker!.once('message', (result: SignalProcessingResult) => {
        clearTimeout(timeout);
        this.isProcessing = false;

        if (result.success) {
          resolve(result.data);
        } else {
          reject(new Error(result.error || 'Worker processing failed'));
        }
      });

      this.worker!.postMessage(task);
    });
  }

  async calculatePortfolioMetrics(signals: UnifiedSignal[], initialBalance: number, riskPerTrade: number) {
    return this.processTask({
      type: 'calculate_portfolio_metrics',
      data: { signals, initialBalance, riskPerTrade }
    });
  }

  async validateSignals(signals: any[]): Promise<UnifiedSignal[]> {
    return this.processTask({
      type: 'validate_signals',
      data: { signals }
    });
  }

  async generateMockSignals(params: any): Promise<UnifiedSignal[]> {
    return this.processTask({
      type: 'generate_mock_signals',
      data: params
    });
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  isAvailable(): boolean {
    return this.worker !== null && !this.isProcessing;
  }
}

// Worker pool for handling multiple concurrent requests
export class SignalProcessorPool {
  private workers: SignalProcessorWorker[] = [];
  private maxWorkers: number;

  constructor(maxWorkers = 4) {
    this.maxWorkers = maxWorkers;
  }

  private getAvailableWorker(): SignalProcessorWorker | null {
    // Find an available worker
    const availableWorker = this.workers.find(worker => worker.isAvailable());
    if (availableWorker) {
      return availableWorker;
    }

    // Create a new worker if under the limit
    if (this.workers.length < this.maxWorkers) {
      const newWorker = new SignalProcessorWorker();
      this.workers.push(newWorker);
      return newWorker;
    }

    return null;
  }

  async processTask<T = any>(task: SignalProcessingTask): Promise<T> {
    const worker = this.getAvailableWorker();

    if (!worker) {
      throw new Error('No workers available - pool is at capacity');
    }

    return worker.processTask<T>(task);
  }

  async calculatePortfolioMetrics(signals: UnifiedSignal[], initialBalance: number, riskPerTrade: number) {
    return this.processTask({
      type: 'calculate_portfolio_metrics',
      data: { signals, initialBalance, riskPerTrade }
    });
  }

  async validateSignals(signals: any[]): Promise<UnifiedSignal[]> {
    return this.processTask({
      type: 'validate_signals',
      data: { signals }
    });
  }

  async generateMockSignals(params: any): Promise<UnifiedSignal[]> {
    return this.processTask({
      type: 'generate_mock_signals',
      data: params
    });
  }

  getStats() {
    return {
      totalWorkers: this.workers.length,
      maxWorkers: this.maxWorkers,
      availableWorkers: this.workers.filter(w => w.isAvailable()).length,
      busyWorkers: this.workers.filter(w => !w.isAvailable()).length
    };
  }

  terminateAll() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
  }
}

// Global worker pool instance
export const signalProcessorPool = new SignalProcessorPool(
  parseInt(process.env.MAX_SIGNAL_WORKERS || '4')
);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down signal processor workers...');
  signalProcessorPool.terminateAll();
});

process.on('SIGINT', () => {
  console.log('Shutting down signal processor workers...');
  signalProcessorPool.terminateAll();
});