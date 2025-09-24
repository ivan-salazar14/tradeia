import Redis from 'ioredis';
import { Logger } from '@/lib/utils/error-handler';
import { EventEmitter } from 'events';

// Message queue interfaces
export interface QueueMessage {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  priority?: number;
  retryCount?: number;
  maxRetries?: number;
  delayUntil?: number;
  correlationId?: string;
}

export interface QueueOptions {
  maxRetries?: number;
  retryDelay?: number;
  priority?: number;
  delay?: number;
  timeout?: number;
  correlationId?: string;
}

export interface QueueStats {
  name: string;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  retry: number;
  avgProcessingTime: number;
}

// Abstract queue interface
export abstract class MessageQueue {
  abstract enqueue(queueName: string, message: QueueMessage, options?: QueueOptions): Promise<void>;
  abstract dequeue(queueName: string): Promise<QueueMessage | null>;
  abstract acknowledge(queueName: string, messageId: string): Promise<void>;
  abstract nack(queueName: string, messageId: string, error?: Error): Promise<void>;
  abstract getStats(queueName: string): Promise<QueueStats>;
  abstract close(): Promise<void>;
}

// Redis-based message queue
export class RedisMessageQueue extends MessageQueue {
  private redis: Redis;
  private processingQueues = new Map<string, Set<string>>();
  private stats = new Map<string, QueueStats>();

  constructor(redisUrl?: string) {
    super();
    this.redis = new Redis(redisUrl || process.env.REDIS_URL || 'redis://localhost:6379');

    this.redis.on('error', (error) => {
      Logger.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      Logger.info('Connected to Redis for message queue');
    });
  }

  async enqueue(queueName: string, message: QueueMessage, options: QueueOptions = {}): Promise<void> {
    try {
      const queueKey = `queue:${queueName}`;
      const processingKey = `processing:${queueName}`;
      const statsKey = `stats:${queueName}`;

      // Set default options
      const finalMessage = {
        ...message,
        retryCount: message.retryCount || 0,
        maxRetries: message.maxRetries || options.maxRetries || 3,
        priority: message.priority || options.priority || 0,
        delayUntil: options.delay ? Date.now() + options.delay : message.delayUntil
      };

      // Use sorted set for priority and delay support
      const score = finalMessage.delayUntil || finalMessage.priority || 0;

      await this.redis.zadd(queueKey, score, JSON.stringify(finalMessage));

      // Update stats
      await this.updateStats(queueName, 'pending', 1);

      Logger.debug(`Enqueued message ${message.id} to ${queueName}`);
    } catch (error) {
      Logger.error(`Failed to enqueue message to ${queueName}:`, error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  async dequeue(queueName: string): Promise<QueueMessage | null> {
    try {
      const queueKey = `queue:${queueName}`;
      const processingKey = `processing:${queueName}`;

      // Get the highest priority message that's ready (delay has passed)
      const now = Date.now();
      const messages = await this.redis.zrange(queueKey, 0, 0, 'WITHSCORES');

      if (messages.length === 0) {
        return null;
      }

      const [messageStr, score] = messages;
      const message: QueueMessage = JSON.parse(messageStr);

      // Check if message is delayed
      if (message.delayUntil && message.delayUntil > now) {
        return null; // Not ready yet
      }

      // Move to processing queue
      await this.redis.zrem(queueKey, messageStr);
      await this.redis.sadd(processingKey, messageStr);

      // Track processing
      if (!this.processingQueues.has(queueName)) {
        this.processingQueues.set(queueName, new Set());
      }
      this.processingQueues.get(queueName)!.add(message.id);

      // Update stats
      await this.updateStats(queueName, 'pending', -1);
      await this.updateStats(queueName, 'processing', 1);

      Logger.debug(`Dequeued message ${message.id} from ${queueName}`);

      return message;
    } catch (error) {
      Logger.error(`Failed to dequeue message from ${queueName}:`, error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  }

  async acknowledge(queueName: string, messageId: string): Promise<void> {
    try {
      const processingKey = `processing:${queueName}`;

      // Remove from processing queue
      const messages = await this.redis.smembers(processingKey);
      for (const messageStr of messages) {
        const message: QueueMessage = JSON.parse(messageStr);
        if (message.id === messageId) {
          await this.redis.srem(processingKey, messageStr);
          break;
        }
      }

      // Update processing tracking
      const processingSet = this.processingQueues.get(queueName);
      if (processingSet) {
        processingSet.delete(messageId);
      }

      // Update stats
      await this.updateStats(queueName, 'processing', -1);
      await this.updateStats(queueName, 'completed', 1);

      Logger.debug(`Acknowledged message ${messageId} from ${queueName}`);
    } catch (error) {
      Logger.error(`Failed to acknowledge message ${messageId}:`, error instanceof Error ? error : new Error(String(error)));
    }
  }

  async nack(queueName: string, messageId: string, error?: Error): Promise<void> {
    try {
      const processingKey = `processing:${queueName}`;
      const queueKey = `queue:${queueName}`;

      // Find and remove from processing
      const messages = await this.redis.smembers(processingKey);
      let message: QueueMessage | null = null;

      for (const messageStr of messages) {
        const parsedMessage: QueueMessage = JSON.parse(messageStr);
        if (parsedMessage.id === messageId) {
          message = parsedMessage;
          await this.redis.srem(processingKey, messageStr);
          break;
        }
      }

      if (!message) {
        Logger.warn(`Message ${messageId} not found in processing queue`);
        return;
      }

      // Update processing tracking
      const processingSet = this.processingQueues.get(queueName);
      if (processingSet) {
        processingSet.delete(messageId);
      }

      // Check retry logic
      const retryCount = (message.retryCount || 0) + 1;
      if (retryCount < (message.maxRetries || 3)) {
        // Re-queue with backoff
        const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff, max 30s
        const retryMessage = {
          ...message,
          retryCount,
          delayUntil: Date.now() + backoffDelay
        };

        await this.redis.zadd(queueKey, retryMessage.delayUntil!, JSON.stringify(retryMessage));

        // Update stats
        await this.updateStats(queueName, 'pending', 1);
        await this.updateStats(queueName, 'retry', 1);

        Logger.info(`Re-queued message ${messageId} for retry ${retryCount} with delay ${backoffDelay}ms`);
      } else {
        // Max retries exceeded
        await this.updateStats(queueName, 'failed', 1);
        Logger.error(`Message ${messageId} failed permanently after ${retryCount} retries:`, error);
      }

      // Update stats
      await this.updateStats(queueName, 'processing', -1);
    } catch (err) {
      Logger.error(`Failed to nack message ${messageId}:`, err instanceof Error ? err : new Error(String(err)));
    }
  }

  async getStats(queueName: string): Promise<QueueStats> {
    try {
      const statsKey = `stats:${queueName}`;
      const stats = await this.redis.hgetall(statsKey);

      return {
        name: queueName,
        pending: parseInt(stats.pending || '0'),
        processing: parseInt(stats.processing || '0'),
        completed: parseInt(stats.completed || '0'),
        failed: parseInt(stats.failed || '0'),
        retry: parseInt(stats.retry || '0'),
        avgProcessingTime: parseFloat(stats.avgProcessingTime || '0')
      };
    } catch (error) {
      Logger.error(`Failed to get stats for queue ${queueName}:`, error instanceof Error ? error : new Error(String(error)));
      return {
        name: queueName,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        retry: 0,
        avgProcessingTime: 0
      };
    }
  }

  private async updateStats(queueName: string, field: keyof QueueStats, delta: number): Promise<void> {
    const statsKey = `stats:${queueName}`;
    await this.redis.hincrby(statsKey, field, delta);
  }

  async close(): Promise<void> {
    await this.redis.quit();
  }
}

// In-memory message queue for development
export class InMemoryMessageQueue extends MessageQueue {
  private queues = new Map<string, QueueMessage[]>();
  private processing = new Map<string, Set<string>>();
  private stats = new Map<string, QueueStats>();

  async enqueue(queueName: string, message: QueueMessage, options: QueueOptions = {}): Promise<void> {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, []);
    }

    const finalMessage = {
      ...message,
      retryCount: message.retryCount || 0,
      maxRetries: message.maxRetries || options.maxRetries || 3,
      priority: message.priority || options.priority || 0,
      delayUntil: options.delay ? Date.now() + options.delay : message.delayUntil
    };

    this.queues.get(queueName)!.push(finalMessage);
    this.updateStats(queueName, 'pending', 1);

    Logger.debug(`Enqueued message ${message.id} to ${queueName} (in-memory)`);
  }

  async dequeue(queueName: string): Promise<QueueMessage | null> {
    const queue = this.queues.get(queueName);
    if (!queue || queue.length === 0) {
      return null;
    }

    const now = Date.now();

    // Find first non-delayed message
    for (let i = 0; i < queue.length; i++) {
      const message = queue[i];
      if (!message.delayUntil || message.delayUntil <= now) {
        queue.splice(i, 1);

        // Add to processing
        if (!this.processing.has(queueName)) {
          this.processing.set(queueName, new Set());
        }
        this.processing.get(queueName)!.add(message.id);

        this.updateStats(queueName, 'pending', -1);
        this.updateStats(queueName, 'processing', 1);

        Logger.debug(`Dequeued message ${message.id} from ${queueName} (in-memory)`);
        return message;
      }
    }

    return null;
  }

  async acknowledge(queueName: string, messageId: string): Promise<void> {
    const processingSet = this.processing.get(queueName);
    if (processingSet) {
      processingSet.delete(messageId);
    }

    this.updateStats(queueName, 'processing', -1);
    this.updateStats(queueName, 'completed', 1);

    Logger.debug(`Acknowledged message ${messageId} from ${queueName} (in-memory)`);
  }

  async nack(queueName: string, messageId: string, error?: Error): Promise<void> {
    const processingSet = this.processing.get(queueName);
    if (processingSet) {
      processingSet.delete(messageId);
    }

    // For in-memory, we don't implement retry logic - just mark as failed
    this.updateStats(queueName, 'processing', -1);
    this.updateStats(queueName, 'failed', 1);

    Logger.error(`Message ${messageId} failed in ${queueName} (in-memory):`, error);
  }

  async getStats(queueName: string): Promise<QueueStats> {
    return this.stats.get(queueName) || {
      name: queueName,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      retry: 0,
      avgProcessingTime: 0
    };
  }

  private updateStats(queueName: string, field: keyof QueueStats, delta: number): void {
    if (!this.stats.has(queueName)) {
      this.stats.set(queueName, {
        name: queueName,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        retry: 0,
        avgProcessingTime: 0
      });
    }

    const stats = this.stats.get(queueName)!;
    (stats[field] as number) += delta;
  }

  async close(): Promise<void> {
    this.queues.clear();
    this.processing.clear();
    this.stats.clear();
  }
}

// Queue manager singleton
export class QueueManager {
  private queue: MessageQueue;
  private workers = new Map<string, QueueWorker>();
  private eventEmitter = new EventEmitter();

  constructor() {
    // Use Redis in production, in-memory for development
    const useRedis = process.env.NODE_ENV === 'production' && process.env.REDIS_URL;
    this.queue = useRedis
      ? new RedisMessageQueue(process.env.REDIS_URL)
      : new InMemoryMessageQueue();

    Logger.info(`Initialized ${useRedis ? 'Redis' : 'in-memory'} message queue`);
  }

  // Enqueue a message
  async enqueue(queueName: string, type: string, payload: any, options: QueueOptions = {}): Promise<string> {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const message: QueueMessage = {
      id: messageId,
      type,
      payload,
      timestamp: Date.now(),
      correlationId: options.correlationId
    };

    await this.queue.enqueue(queueName, message, options);

    this.eventEmitter.emit('messageEnqueued', { queueName, message });

    return messageId;
  }

  // Register a worker for a queue
  registerWorker(queueName: string, worker: QueueWorker): void {
    this.workers.set(queueName, worker);
    Logger.info(`Registered worker for queue: ${queueName}`);
  }

  // Start processing a queue
  async startProcessing(queueName: string, concurrency = 1): Promise<void> {
    const worker = this.workers.get(queueName);
    if (!worker) {
      throw new Error(`No worker registered for queue: ${queueName}`);
    }

    for (let i = 0; i < concurrency; i++) {
      this.processQueue(queueName, worker);
    }

    Logger.info(`Started processing queue: ${queueName} with concurrency: ${concurrency}`);
  }

  private async processQueue(queueName: string, worker: QueueWorker): Promise<void> {
    while (true) {
      try {
        const message = await this.queue.dequeue(queueName);

        if (!message) {
          // No messages available, wait a bit
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        this.eventEmitter.emit('messageProcessing', { queueName, message });

        const startTime = Date.now();

        try {
          await worker.process(message);
          await this.queue.acknowledge(queueName, message.id);

          const processingTime = Date.now() - startTime;
          this.eventEmitter.emit('messageCompleted', { queueName, message, processingTime });

          Logger.debug(`Processed message ${message.id} in ${processingTime}ms`);
        } catch (error) {
          Logger.error(`Worker failed to process message ${message.id}:`, error instanceof Error ? error : new Error(String(error)));
          await this.queue.nack(queueName, message.id, error as Error);

          this.eventEmitter.emit('messageFailed', { queueName, message, error });
        }
      } catch (error) {
        Logger.error(`Error processing queue ${queueName}:`, error instanceof Error ? error : new Error(String(error)));
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  // Get queue statistics
  async getStats(queueName: string): Promise<QueueStats> {
    return this.queue.getStats(queueName);
  }

  // Get all queue statistics
  async getAllStats(): Promise<Record<string, QueueStats>> {
    const stats: Record<string, QueueStats> = {};

    for (const queueName of this.workers.keys()) {
      stats[queueName] = await this.getStats(queueName);
    }

    return stats;
  }

  // Event listeners
  on(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.on(event, listener);
  }

  // Close all connections
  async close(): Promise<void> {
    await this.queue.close();
  }
}

// Worker interface
export interface QueueWorker {
  process(message: QueueMessage): Promise<void>;
}

// Global queue manager instance
export const queueManager = new QueueManager();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Closing message queues...');
  await queueManager.close();
});

process.on('SIGINT', async () => {
  console.log('Closing message queues...');
  await queueManager.close();
});