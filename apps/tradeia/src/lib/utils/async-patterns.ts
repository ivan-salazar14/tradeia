import { Logger } from './error-handler';

// Async Iterator for processing large datasets in chunks
export class AsyncDataIterator<T> implements AsyncIterableIterator<T> {
  private data: T[];
  private index: number;
  private batchSize: number;
  private delayMs: number;

  constructor(data: T[], options: { batchSize?: number; delayMs?: number } = {}) {
    this.data = data;
    this.index = 0;
    this.batchSize = options.batchSize || 10;
    this.delayMs = options.delayMs || 0;
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return this;
  }

  async next(): Promise<IteratorResult<T, undefined>> {
    if (this.index >= this.data.length) {
      return { done: true, value: undefined };
    }

    // Add delay between batches to prevent overwhelming the system
    if (this.delayMs > 0 && this.index > 0 && this.index % this.batchSize === 0) {
      await new Promise(resolve => setTimeout(resolve, this.delayMs));
    }

    const value = this.data[this.index];
    this.index++;

    return { done: false, value };
  }
}

// Stream-based data processor
export class DataStreamProcessor<T, R> {
  private transformers: Array<(data: T) => Promise<R> | R> = [];
  private filters: Array<(data: R) => boolean> = [];
  private errorHandler?: (error: Error, data: T) => Promise<R | null> | R | null;

  // Add a transformation function
  transform(transformer: (data: T) => Promise<R> | R): DataStreamProcessor<T, R> {
    this.transformers.push(transformer);
    return this;
  }

  // Add a filter function
  filter(predicate: (data: R) => boolean): DataStreamProcessor<T, R> {
    this.filters.push(predicate);
    return this;
  }

  // Set error handler
  onError(handler: (error: Error, data: T) => Promise<R | null> | R | null): DataStreamProcessor<T, R> {
    this.errorHandler = handler;
    return this;
  }

  // Process data through the pipeline
  async process(data: T[]): Promise<R[]> {
    const results: R[] = [];

    for (const item of data) {
      try {
        let result: R = item as unknown as R; // Type assertion for initial value

        // Apply transformations
        for (const transformer of this.transformers) {
          result = await transformer(item as unknown as T);
        }

        // Apply filters
        let passesFilters = true;
        for (const filter of this.filters) {
          if (!filter(result)) {
            passesFilters = false;
            break;
          }
        }

        if (passesFilters) {
          results.push(result);
        }
      } catch (error) {
        if (this.errorHandler) {
          try {
            const errorResult = await this.errorHandler(error as Error, item);
            if (errorResult !== null) {
              results.push(errorResult);
            }
          } catch (handlerError) {
            Logger.error('Error in error handler:', handlerError as Error);
          }
        } else {
          Logger.error('Data processing error:', error as Error, { item });
        }
      }
    }

    return results;
  }

  // Process data as a stream
  async *processStream(data: T[]): AsyncGenerator<R, void, unknown> {
    for (const item of data) {
      try {
        let result: R = item as unknown as R;

        // Apply transformations
        for (const transformer of this.transformers) {
          result = await transformer(item as unknown as T);
          yield result; // Yield intermediate results
        }

        // Apply filters
        let passesFilters = true;
        for (const filter of this.filters) {
          if (!filter(result)) {
            passesFilters = false;
            break;
          }
        }

        if (passesFilters) {
          yield result;
        }
      } catch (error) {
        if (this.errorHandler) {
          try {
            const errorResult = await this.errorHandler(error as Error, item);
            if (errorResult !== null) {
              yield errorResult;
            }
          } catch (handlerError) {
            Logger.error('Error in stream error handler:', handlerError as Error);
          }
        } else {
          Logger.error('Stream processing error:', error as Error, { item });
        }
      }
    }
  }
}

// Promise utilities for advanced async patterns
export class AsyncUtils {
  // Execute tasks with concurrency control
  static async executeConcurrent<T>(
    tasks: Array<() => Promise<T>>,
    limit: number
  ): Promise<T[]> {
    const results: T[] = [];
    const executing: Promise<void>[] = [];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      // Start task
      const promise = task()
        .then(result => {
          results[i] = result;
        })
        .catch(error => {
          Logger.error('Concurrent task error:', error);
          throw error;
        })
        .finally(() => {
          const index = executing.indexOf(promise);
          if (index > -1) {
            executing.splice(index, 1);
          }
        });

      executing.push(promise);

      // Wait if we've reached the concurrency limit
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }

    // Wait for all remaining tasks to complete
    await Promise.all(executing);

    return results;
  }

  // Retry mechanism with exponential backoff
  static async retry<T>(
    fn: () => Promise<T>,
    options: {
      maxAttempts?: number;
      baseDelay?: number;
      maxDelay?: number;
      backoffFactor?: number;
      retryCondition?: (error: Error) => boolean;
    } = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      baseDelay = 1000,
      maxDelay = 30000,
      backoffFactor = 2,
      retryCondition = () => true
    } = options;

    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxAttempts || !retryCondition(lastError)) {
          throw lastError;
        }

        const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);
        Logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, lastError.message);

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  // Timeout wrapper for promises
  static async timeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutMessage = 'Operation timed out'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(timeoutMessage));
      }, timeoutMs);

      promise
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeoutId));
    });
  }

  // Race multiple promises with a default value
  static async raceWithDefault<T>(
    promises: Promise<T>[],
    defaultValue: T,
    timeoutMs = 5000
  ): Promise<T> {
    try {
      return await AsyncUtils.timeout(
        Promise.race(promises),
        timeoutMs,
        'All promises timed out'
      );
    } catch (error) {
      Logger.warn('Race with default fallback:', error);
      return defaultValue;
    }
  }

  // Batch processor for handling large datasets
  static async *batchProcessor<T, R>(
    items: T[],
    processor: (batch: T[]) => Promise<R[]>,
    batchSize: number = 10
  ): AsyncGenerator<R, void, unknown> {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const results = await processor(batch);

      for (const result of results) {
        yield result;
      }

      // Small delay between batches to prevent overwhelming
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
  }

  // Circuit breaker aware async execution
  static async withCircuitBreaker<T>(
    fn: () => Promise<T>,
    breaker: { execute: (fn: () => Promise<T>) => Promise<T> }
  ): Promise<T> {
    return breaker.execute(fn);
  }
}

// Resource pool for managing expensive resources
export class ResourcePool<T> {
  private available: T[] = [];
  private waitingQueue: Array<{
    resolve: (resource: T) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }> = [];
  private createResource: () => Promise<T> | T;
  private destroyResource?: (resource: T) => Promise<void> | void;
  private maxSize: number;
  private timeout: number;

  constructor(
    createResource: () => Promise<T> | T,
    options: {
      maxSize?: number;
      timeout?: number;
      destroyResource?: (resource: T) => Promise<void> | void;
    } = {}
  ) {
    this.createResource = createResource;
    this.destroyResource = options.destroyResource;
    this.maxSize = options.maxSize || 10;
    this.timeout = options.timeout || 30000;
  }

  async acquire(): Promise<T> {
    // Return available resource immediately
    if (this.available.length > 0) {
      return this.available.pop()!;
    }

    // Check if we can create a new resource
    if (this.available.length + this.waitingQueue.length < this.maxSize) {
      try {
        const resource = await this.createResource();
        return resource;
      } catch (error) {
        throw new Error(`Failed to create resource: ${error}`);
      }
    }

    // Wait for a resource to become available
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const index = this.waitingQueue.findIndex(item => item.timeout === timeoutId);
        if (index > -1) {
          this.waitingQueue.splice(index, 1);
        }
        reject(new Error('Resource acquisition timeout'));
      }, this.timeout);

      this.waitingQueue.push({ resolve, reject, timeout: timeoutId });
    });
  }

  async release(resource: T): Promise<void> {
    // Destroy resource if we have too many or if destroy function is provided
    if (this.available.length >= this.maxSize && this.destroyResource) {
      await this.destroyResource(resource);
      return;
    }

    // Return to pool
    this.available.push(resource);

    // Notify waiting requests
    if (this.waitingQueue.length > 0) {
      const waiting = this.waitingQueue.shift()!;
      clearTimeout(waiting.timeout);
      waiting.resolve(this.available.pop()!);
    }
  }

  async withResource<R>(callback: (resource: T) => Promise<R>): Promise<R> {
    const resource = await this.acquire();

    try {
      return await callback(resource);
    } finally {
      await this.release(resource);
    }
  }

  getStats() {
    return {
      available: this.available.length,
      waiting: this.waitingQueue.length,
      maxSize: this.maxSize
    };
  }

  async close(): Promise<void> {
    // Reject all waiting requests
    for (const waiting of this.waitingQueue) {
      clearTimeout(waiting.timeout);
      waiting.reject(new Error('Resource pool is closing'));
    }
    this.waitingQueue = [];

    // Destroy all available resources
    if (this.destroyResource) {
      for (const resource of this.available) {
        await this.destroyResource(resource);
      }
    }
    this.available = [];
  }
}

// Specialized pools for common resources
export const pools = {
  // CPU-intensive task pool
  cpuTasks: new ResourcePool(
    () => ({ id: Math.random(), available: true }),
    { maxSize: parseInt(process.env.MAX_CPU_WORKERS || '4') }
  ),

  // Memory buffer pool
  buffers: new ResourcePool(
    () => Buffer.alloc(1024 * 1024), // 1MB buffers
    {
      maxSize: 10,
      destroyResource: (buffer: Buffer) => {
        // Buffer cleanup if needed
      }
    }
  )
};

// Cleanup on process exit
process.on('SIGTERM', async () => {
  console.log('Closing resource pools...');
  await pools.cpuTasks.close();
  await pools.buffers.close();
});

process.on('SIGINT', async () => {
  console.log('Closing resource pools...');
  await pools.cpuTasks.close();
  await pools.buffers.close();
});