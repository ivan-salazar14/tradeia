import { queueManager, JobType, JobPriority, SignalProcessingWorker, NotificationWorker } from '../../lib/jobs/background-jobs';

describe('Background Jobs Integration', () => {
  beforeEach(() => {
    // Register test workers
    queueManager.registerWorker('signals', new SignalProcessingWorker());
    queueManager.registerWorker('notifications', new NotificationWorker());
  });

  afterEach(async () => {
    // Clean up after each test
    await queueManager.close();
  });

  describe('Job Processing Flow', () => {
    it('should process signal jobs end-to-end', async () => {
      const jobId = await queueManager.enqueue('signals', JobType.PROCESS_SIGNALS, {
        signals: [{
          id: 'test-signal-1',
          symbol: 'BTC/USDT',
          timeframe: '4h',
          direction: 'BUY',
          entry: 50000,
          tp1: 51000,
          stopLoss: 49000
        }],
        userId: 'test-user-123',
        strategyIds: ['moderate']
      }, {
        priority: JobPriority.HIGH,
        correlationId: 'integration-test-1'
      });

      expect(jobId).toBeDefined();
      expect(typeof jobId).toBe('string');

      // Start processing
      await queueManager.startProcessing('signals', 1);

      // Wait for processing to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check stats
      const stats = await queueManager.getStats('signals');
      expect(stats).toBeDefined();
      expect(stats.completed).toBeGreaterThan(0);
    }, 5000);

    it('should handle notification jobs', async () => {
      const jobId = await queueManager.enqueue('notifications', 'custom_notification', {
        userId: 'test-user-456',
        type: 'info',
        title: 'Integration Test',
        message: 'This is an integration test notification'
      }, {
        priority: JobPriority.NORMAL
      });

      expect(jobId).toBeDefined();

      // Start processing
      await queueManager.startProcessing('notifications', 1);

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check stats
      const stats = await queueManager.getStats('notifications');
      expect(stats.completed).toBeGreaterThan(0);
    });

    it('should handle multiple jobs concurrently', async () => {
      // Enqueue multiple jobs
      const jobIds = [];
      for (let i = 0; i < 5; i++) {
        const jobId = await queueManager.enqueue('signals', JobType.PROCESS_SIGNALS, {
          signals: [{
            id: `signal-${i}`,
            symbol: 'BTC/USDT',
            timeframe: '4h',
            direction: 'BUY',
            entry: 50000 + i * 1000
          }],
          userId: `user-${i}`,
          strategyIds: ['moderate']
        });
        jobIds.push(jobId);
      }

      expect(jobIds).toHaveLength(5);

      // Start processing with concurrency
      await queueManager.startProcessing('signals', 2);

      // Wait for all jobs to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      const stats = await queueManager.getStats('signals');
      expect(stats.completed).toBe(5);
      expect(stats.pending).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle job processing errors gracefully', async () => {
      // Enqueue a job that might fail
      const jobId = await queueManager.enqueue('signals', JobType.PROCESS_SIGNALS, {
        signals: [], // Empty signals array might cause issues
        userId: 'test-user-error',
        strategyIds: []
      });

      expect(jobId).toBeDefined();

      // Start processing
      await queueManager.startProcessing('signals', 1);

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      const stats = await queueManager.getStats('signals');
      // Job should either complete or fail, but not hang
      expect(stats.completed + stats.failed).toBeGreaterThan(0);
    });
  });

  describe('Priority Handling', () => {
    it('should respect job priorities', async () => {
      // Enqueue jobs with different priorities
      const highPriorityJob = await queueManager.enqueue('signals', JobType.PROCESS_SIGNALS, {
        signals: [{ id: 'high-priority', symbol: 'BTC/USDT', direction: 'BUY' }],
        userId: 'high-priority-user',
        strategyIds: ['moderate']
      }, { priority: JobPriority.HIGH });

      const lowPriorityJob = await queueManager.enqueue('signals', JobType.PROCESS_SIGNALS, {
        signals: [{ id: 'low-priority', symbol: 'ETH/USDT', direction: 'SELL' }],
        userId: 'low-priority-user',
        strategyIds: ['conservative']
      }, { priority: JobPriority.LOW });

      expect(highPriorityJob).toBeDefined();
      expect(lowPriorityJob).toBeDefined();

      // Both jobs should be enqueued
      const stats = await queueManager.getStats('signals');
      expect(stats.pending).toBe(2);
    });
  });

  describe('Queue Statistics', () => {
    it('should provide accurate queue statistics', async () => {
      // Start with clean stats
      const initialStats = await queueManager.getStats('signals');
      const initialTotal = initialStats.pending + initialStats.processing + initialStats.completed + initialStats.failed;

      // Enqueue some jobs
      await queueManager.enqueue('signals', JobType.PROCESS_SIGNALS, {
        signals: [{ id: 'stats-test', symbol: 'BTC/USDT', direction: 'BUY' }],
        userId: 'stats-user',
        strategyIds: ['moderate']
      });

      const afterEnqueueStats = await queueManager.getStats('signals');
      expect(afterEnqueueStats.pending).toBe(initialStats.pending + 1);

      // Process the job
      await queueManager.startProcessing('signals', 1);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const afterProcessingStats = await queueManager.getStats('signals');
      expect(afterProcessingStats.completed).toBe(initialStats.completed + 1);
      expect(afterProcessingStats.pending).toBe(initialStats.pending);
    });
  });
});