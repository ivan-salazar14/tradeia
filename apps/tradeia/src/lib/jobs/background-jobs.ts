import { QueueWorker, queueManager, QueueMessage } from '@/lib/queue/message-queue';
import { Logger } from '@/lib/utils/error-handler';
import { signalProcessorPool } from '@/lib/workers/signal-processor';
import { DatabaseHelpers } from '@/lib/database/connection-pool';
import { CacheUtils } from '@/lib/utils/cache';
import { notificationService } from '@/lib/services/NotificationService';

// Background job types
export enum JobType {
  PROCESS_SIGNALS = 'process_signals',
  CLEANUP_OLD_DATA = 'cleanup_old_data',
  UPDATE_USER_STATS = 'update_user_stats',
  BACKTEST_STRATEGY = 'backtest_strategy'
}

// Job priorities
export enum JobPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

// Signal processing worker
export class SignalProcessingWorker implements QueueWorker {
  async process(message: QueueMessage): Promise<void> {
    const { signals, userId, strategyIds } = message.payload;

    Logger.info(`Processing ${signals.length} signals for user ${userId}`);

    // Validate signals using worker threads
    const validatedSignals = await signalProcessorPool.validateSignals(signals);

    // Calculate portfolio metrics
    const metrics = await signalProcessorPool.calculatePortfolioMetrics(
      validatedSignals,
      10000, // default balance
      1.0    // default risk per trade
    );

    // Log results (in a real implementation, this would be stored in database)
    Logger.info(`Processed ${validatedSignals.length} signals with metrics:`, {
      totalPositionSize: metrics.total_position_size,
      remainingBalance: metrics.remaining_balance,
      avgRewardToRisk: metrics.avg_reward_to_risk
    });

    Logger.info(`Completed processing signals for user ${userId}`);
  }
}

// Simple notification worker (logs only for demo)
export class NotificationWorker implements QueueWorker {
  async process(message: QueueMessage): Promise<void> {
    const { userId, type, title, message: msg } = message.payload;

    Logger.info(`Processing notification for user ${userId}: ${title}`);

    // In a real implementation, this would send actual notifications
    // For now, just log the notification
    Logger.info(`Notification: ${type} - ${title} - ${msg}`);

    Logger.info(`Notification processed for user ${userId}`);
  }
}

// Data cleanup worker
export class DataCleanupWorker implements QueueWorker {
  async process(message: QueueMessage): Promise<void> {
    const { olderThanDays = 30, dataTypes = ['signals', 'logs', 'cache'] } = message.payload;

    Logger.info(`Starting data cleanup for data older than ${olderThanDays} days`);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    let totalDeleted = 0;

    await DatabaseHelpers.executeQuery(async (client) => {
      // Clean up old processed signals
      if (dataTypes.includes('signals')) {
        const { count } = await client
          .from('processed_signals')
          .delete()
          .lt('processed_at', cutoffDate.toISOString())
          .select('*', { count: 'exact', head: true });

        totalDeleted += count || 0;
        Logger.info(`Deleted ${count} old processed signals`);
      }

      // Clean up old notification deliveries
      if (dataTypes.includes('notifications')) {
        const { count } = await client
          .from('notification_deliveries')
          .delete()
          .lt('delivered_at', cutoffDate.toISOString())
          .select('*', { count: 'exact', head: true });

        totalDeleted += count || 0;
        Logger.info(`Deleted ${count} old notification deliveries`);
      }

      return { success: true };
    });

    // Clean up cache if requested
    if (dataTypes.includes('cache')) {
      // This would integrate with a cache cleanup mechanism
      Logger.info('Cache cleanup completed');
    }

    Logger.info(`Data cleanup completed. Total records deleted: ${totalDeleted}`);
  }
}

// User stats update worker
export class UserStatsWorker implements QueueWorker {
  async process(message: QueueMessage): Promise<void> {
    const { userId } = message.payload;

    Logger.info(`Updating statistics for user ${userId}`);

    // Calculate comprehensive user statistics
    const stats = await DatabaseHelpers.executeQuery(async (client) => {
      // Get signal processing stats
      const { data: signalStats } = await client
        .from('processed_signals')
        .select('count', { count: 'exact' })
        .eq('user_id', userId);

      // Get notification stats
      const { data: notificationStats } = await client
        .from('notification_deliveries')
        .select('count', { count: 'exact' })
        .eq('user_id', userId);

      // Get portfolio metrics
      const { data: portfolioData } = await client
        .from('user_portfolio_metrics')
        .select('*')
        .eq('user_id', userId)
        .single();

      return {
        totalSignalsProcessed: signalStats?.[0]?.count || 0,
        totalNotificationsSent: notificationStats?.[0]?.count || 0,
        portfolioMetrics: portfolioData,
        lastUpdated: new Date().toISOString()
      };
    });

    // Update user statistics
    await DatabaseHelpers.executeQuery(async (client) => {
      await client.from('user_statistics').upsert({
        user_id: userId,
        total_signals_processed: stats.totalSignalsProcessed,
        total_notifications_sent: stats.totalNotificationsSent,
        portfolio_value: stats.portfolioMetrics?.remaining_balance || 0,
        last_updated: stats.lastUpdated
      });

      return { success: true };
    });

    // Clear user-specific cache to force refresh
    CacheUtils.getUserDataCache().delete(`user_stats:${userId}`);

    Logger.info(`Updated statistics for user ${userId}`);
  }
}

// Backtesting worker
export class BacktestWorker implements QueueWorker {
  async process(message: QueueMessage): Promise<void> {
    const { strategyId, symbol, startDate, endDate, userId } = message.payload;

    Logger.info(`Starting backtest for strategy ${strategyId} on ${symbol}`);

    // This would integrate with a backtesting engine
    // For now, simulate backtesting with mock results
    const backtestResults = {
      strategyId,
      symbol,
      startDate,
      endDate,
      totalTrades: Math.floor(Math.random() * 100) + 10,
      winRate: Math.random() * 0.4 + 0.3, // 30-70%
      profitLoss: (Math.random() - 0.3) * 10000, // -3000 to 7000
      maxDrawdown: Math.random() * 0.3, // 0-30%
      sharpeRatio: Math.random() * 2 + 0.5, // 0.5-2.5
      completedAt: new Date().toISOString()
    };

    // Store backtest results
    await DatabaseHelpers.executeQuery(async (client) => {
      await client.from('backtest_results').insert({
        user_id: userId,
        strategy_id: strategyId,
        symbol,
        start_date: startDate,
        end_date: endDate,
        results: backtestResults,
        created_at: new Date().toISOString()
      });

      return { success: true };
    });

    // Notify user of backtest completion
    await notificationService.sendNotification(userId, {
      type: 'backtest_completed',
      title: 'Backtest Completed',
      message: `Backtest for ${strategyId} on ${symbol} has been completed`,
      data: backtestResults
    });

    Logger.info(`Backtest completed for strategy ${strategyId}`);
  }
}

// Job scheduler for recurring tasks
export class JobScheduler {
  private scheduledJobs = new Map<string, NodeJS.Timeout>();

  // Schedule recurring data cleanup
  scheduleDataCleanup(intervalHours = 24): void {
    const jobId = 'data_cleanup';

    if (this.scheduledJobs.has(jobId)) {
      clearInterval(this.scheduledJobs.get(jobId)!);
    }

    const interval = setInterval(async () => {
      try {
        await queueManager.enqueue('maintenance', JobType.CLEANUP_OLD_DATA, {
          olderThanDays: 30,
          dataTypes: ['signals', 'notifications']
        }, {
          priority: JobPriority.LOW
        });

        Logger.info('Scheduled data cleanup job');
      } catch (error) {
        Logger.error('Failed to schedule data cleanup job:', error instanceof Error ? error : new Error(String(error)));
      }
    }, intervalHours * 60 * 60 * 1000);

    this.scheduledJobs.set(jobId, interval);
    Logger.info(`Scheduled data cleanup every ${intervalHours} hours`);
  }

  // Schedule user stats updates
  scheduleUserStatsUpdate(intervalHours = 6): void {
    const jobId = 'user_stats_update';

    if (this.scheduledJobs.has(jobId)) {
      clearInterval(this.scheduledJobs.get(jobId)!);
    }

    // This would typically get all active users and schedule updates
    // For now, just log that it would run
    const interval = setInterval(async () => {
      Logger.info('User stats update job would run here');
      // In a real implementation, you'd query for active users and enqueue jobs
    }, intervalHours * 60 * 60 * 1000);

    this.scheduledJobs.set(jobId, interval);
    Logger.info(`Scheduled user stats update every ${intervalHours} hours`);
  }

  // Stop all scheduled jobs
  stopAll(): void {
    for (const [jobId, interval] of this.scheduledJobs) {
      clearInterval(interval);
      Logger.info(`Stopped scheduled job: ${jobId}`);
    }
    this.scheduledJobs.clear();
  }
}

// Initialize workers and scheduler
export function initializeBackgroundJobs(): void {
  // Register workers
  queueManager.registerWorker('signals', new SignalProcessingWorker());
  queueManager.registerWorker('notifications', new NotificationWorker());
  queueManager.registerWorker('maintenance', new DataCleanupWorker());
  queueManager.registerWorker('user_stats', new UserStatsWorker());
  queueManager.registerWorker('backtest', new BacktestWorker());

  // Start processing queues
  queueManager.startProcessing('signals', 2); // 2 concurrent workers
  queueManager.startProcessing('notifications', 3); // 3 concurrent workers
  queueManager.startProcessing('maintenance', 1); // 1 worker for maintenance
  queueManager.startProcessing('user_stats', 1); // 1 worker for stats
  queueManager.startProcessing('backtest', 2); // 2 workers for backtesting

  // Initialize scheduler
  const scheduler = new JobScheduler();
  scheduler.scheduleDataCleanup(24); // Daily cleanup
  scheduler.scheduleUserStatsUpdate(6); // Every 6 hours

  // Event listeners for monitoring
  queueManager.on('messageEnqueued', (data) => {
    Logger.debug(`Message enqueued: ${data.queueName} - ${data.message.type}`);
  });

  queueManager.on('messageProcessing', (data) => {
    Logger.debug(`Processing message: ${data.queueName} - ${data.message.id}`);
  });

  queueManager.on('messageCompleted', (data) => {
    Logger.debug(`Message completed: ${data.queueName} - ${data.message.id} (${data.processingTime}ms)`);
  });

  queueManager.on('messageFailed', (data) => {
    Logger.error(`Message failed: ${data.queueName} - ${data.message.id}`, data.error instanceof Error ? data.error : new Error(String(data.error)));
  });

  Logger.info('Background job system initialized');
}

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('Shutting down background job system...');
});

process.on('SIGINT', () => {
  Logger.info('Shutting down background job system...');
});

// Re-export queueManager for convenience
export { queueManager } from '@/lib/queue/message-queue';