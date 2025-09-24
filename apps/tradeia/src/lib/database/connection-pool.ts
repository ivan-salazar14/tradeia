import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Logger } from '@/lib/utils/error-handler';

interface PoolConfig {
  minConnections: number;
  maxConnections: number;
  acquireTimeoutMillis: number;
  idleTimeoutMillis: number;
  reapIntervalMillis: number;
  healthCheckInterval: number;
}

interface PooledConnection {
  client: SupabaseClient;
  id: string;
  createdAt: number;
  lastUsed: number;
  inUse: boolean;
  healthy: boolean;
}

export class SupabaseConnectionPool {
  private pool: PooledConnection[] = [];
  private waitingQueue: Array<{
    resolve: (connection: SupabaseClient) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }> = [];

  private config: PoolConfig;
  private healthCheckTimer?: NodeJS.Timeout;
  private reapTimer?: NodeJS.Timeout;

  constructor(config: Partial<PoolConfig> = {}) {
    this.config = {
      minConnections: 2,
      maxConnections: 20,
      acquireTimeoutMillis: 30000, // 30 seconds
      idleTimeoutMillis: 300000, // 5 minutes
      reapIntervalMillis: 60000, // 1 minute
      healthCheckInterval: 30000, // 30 seconds
      ...config
    };

    this.initializePool();
    this.startHealthChecks();
    this.startReaping();
  }

  private initializePool() {
    for (let i = 0; i < this.config.minConnections; i++) {
      this.createConnection();
    }
  }

  private createConnection(): PooledConnection {
    const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );

      const pooledConnection: PooledConnection = {
        client,
        id: connectionId,
        createdAt: Date.now(),
        lastUsed: Date.now(),
        inUse: false,
        healthy: true
      };

      this.pool.push(pooledConnection);
      Logger.debug(`Created database connection: ${connectionId}`);

      return pooledConnection;
    } catch (error) {
      Logger.error(`Failed to create database connection: ${connectionId}`, error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  private async checkConnectionHealth(connection: PooledConnection): Promise<boolean> {
    try {
      // Simple health check query
      const { error } = await connection.client
        .from('users')
        .select('count', { count: 'exact', head: true })
        .limit(1);

      return !error;
    } catch (error) {
      Logger.warn(`Health check failed for connection ${connection.id}:`, error);
      return false;
    }
  }

  private startHealthChecks() {
    this.healthCheckTimer = setInterval(async () => {
      const unhealthyConnections = [];

      for (const connection of this.pool) {
        if (!connection.inUse) {
          connection.healthy = await this.checkConnectionHealth(connection);
          if (!connection.healthy) {
            unhealthyConnections.push(connection);
          }
        }
      }

      // Remove unhealthy connections
      for (const connection of unhealthyConnections) {
        await this.destroyConnection(connection);
      }

      // Ensure minimum connections
      while (this.pool.length < this.config.minConnections) {
        this.createConnection();
      }
    }, this.config.healthCheckInterval);
  }

  private startReaping() {
    this.reapTimer = setInterval(() => {
      const now = Date.now();
      const idleConnections = this.pool.filter(
        conn => !conn.inUse &&
               (now - conn.lastUsed) > this.config.idleTimeoutMillis &&
               this.pool.length > this.config.minConnections
      );

      for (const connection of idleConnections) {
        this.destroyConnection(connection);
      }
    }, this.config.reapIntervalMillis);
  }

  private async destroyConnection(connection: PooledConnection) {
    try {
      // Supabase clients don't need explicit cleanup, but we can mark them as unhealthy
      const index = this.pool.indexOf(connection);
      if (index > -1) {
        this.pool.splice(index, 1);
        Logger.debug(`Destroyed database connection: ${connection.id}`);
      }
    } catch (error) {
      Logger.error(`Error destroying connection ${connection.id}:`, error instanceof Error ? error : new Error(String(error)));
    }
  }

  async acquire(): Promise<SupabaseClient> {
    return new Promise((resolve, reject) => {
      // Try to get an available connection immediately
      const availableConnection = this.pool.find(conn => !conn.inUse && conn.healthy);

      if (availableConnection) {
        availableConnection.inUse = true;
        availableConnection.lastUsed = Date.now();
        resolve(availableConnection.client);
        return;
      }

      // Check if we can create a new connection
      if (this.pool.length < this.config.maxConnections) {
        try {
          const newConnection = this.createConnection();
          newConnection.inUse = true;
          newConnection.lastUsed = Date.now();
          resolve(newConnection.client);
          return;
        } catch (error) {
          // Fall through to queue
        }
      }

      // Add to waiting queue
      const timeout = setTimeout(() => {
        // Remove from queue
        const index = this.waitingQueue.findIndex(item => item.timeout === timeout);
        if (index > -1) {
          this.waitingQueue.splice(index, 1);
        }
        reject(new Error('Connection acquire timeout'));
      }, this.config.acquireTimeoutMillis);

      this.waitingQueue.push({ resolve, reject, timeout });
    });
  }

  async release(client: SupabaseClient) {
    const connection = this.pool.find(conn => conn.client === client);
    if (connection) {
      connection.inUse = false;
      connection.lastUsed = Date.now();

      // Check if there are waiting requests
      if (this.waitingQueue.length > 0) {
        const waiting = this.waitingQueue.shift()!;
        clearTimeout(waiting.timeout);

        connection.inUse = true;
        connection.lastUsed = Date.now();
        waiting.resolve(connection.client);
      }
    }
  }

  async withConnection<T>(
    callback: (client: SupabaseClient) => Promise<T>
  ): Promise<T> {
    const client = await this.acquire();

    try {
      const result = await callback(client);
      return result;
    } finally {
      await this.release(client);
    }
  }

  getStats() {
    const now = Date.now();
    const totalConnections = this.pool.length;
    const activeConnections = this.pool.filter(conn => conn.inUse).length;
    const idleConnections = this.pool.filter(conn => !conn.inUse).length;
    const healthyConnections = this.pool.filter(conn => conn.healthy).length;
    const unhealthyConnections = this.pool.filter(conn => !conn.healthy).length;
    const waitingRequests = this.waitingQueue.length;

    const avgConnectionAge = totalConnections > 0
      ? this.pool.reduce((sum, conn) => sum + (now - conn.createdAt), 0) / totalConnections / 1000
      : 0;

    return {
      totalConnections,
      activeConnections,
      idleConnections,
      healthyConnections,
      unhealthyConnections,
      waitingRequests,
      avgConnectionAgeSeconds: Math.round(avgConnectionAge),
      poolUtilization: totalConnections > 0 ? (activeConnections / totalConnections) * 100 : 0
    };
  }

  async close() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    if (this.reapTimer) {
      clearInterval(this.reapTimer);
    }

    // Reject all waiting requests
    for (const waiting of this.waitingQueue) {
      clearTimeout(waiting.timeout);
      waiting.reject(new Error('Connection pool is closing'));
    }
    this.waitingQueue = [];

    // Close all connections
    for (const connection of this.pool) {
      await this.destroyConnection(connection);
    }
    this.pool = [];
  }
}

// Global connection pool instance
export const dbConnectionPool = new SupabaseConnectionPool({
  minConnections: parseInt(process.env.DB_MIN_CONNECTIONS || '2'),
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
  acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '30000'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '300000'),
  healthCheckInterval: parseInt(process.env.DB_HEALTH_CHECK_INTERVAL || '30000')
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Closing database connection pool...');
  await dbConnectionPool.close();
});

process.on('SIGINT', async () => {
  console.log('Closing database connection pool...');
  await dbConnectionPool.close();
});

// Helper functions for common database operations
export const DatabaseHelpers = {
  // Execute a query with connection pooling
  async executeQuery<T = any>(
    queryFn: (client: SupabaseClient) => Promise<{ data: T | null; error: any }>
  ): Promise<T> {
    return dbConnectionPool.withConnection(async (client) => {
      const { data, error } = await queryFn(client);

      if (error) {
        Logger.error('Database query error:', error);
        throw error;
      }

      return data as T;
    });
  },

  // Get user strategies with caching
  async getUserStrategies(userId: string): Promise<string[]> {
    const cacheKey = `user_strategies:${userId}`;
    const cached = CacheUtils.getUserDataCache().get(cacheKey);

    if (cached) {
      return cached;
    }

    const strategies = await DatabaseHelpers.executeQuery(async (client) => {
      return client
        .from('user_strategies')
        .select('strategy_id')
        .eq('user_id', userId)
        .eq('is_active', true);
    });

    const strategyIds = strategies?.map((s: any) => s.strategy_id) || [];
    CacheUtils.getUserDataCache().set(cacheKey, strategyIds, 10 * 60 * 1000); // 10 minutes

    return strategyIds;
  },

  // Health check for database
  async healthCheck(): Promise<{ healthy: boolean; responseTime: number; connectionCount: number }> {
    const startTime = Date.now();

    try {
      await DatabaseHelpers.executeQuery(async (client) => {
        return client
          .from('users')
          .select('count', { count: 'exact', head: true })
          .limit(1);
      });

      const responseTime = Date.now() - startTime;
      const stats = dbConnectionPool.getStats();

      return {
        healthy: true,
        responseTime,
        connectionCount: stats.totalConnections
      };
    } catch (error) {
      return {
        healthy: false,
        responseTime: Date.now() - startTime,
        connectionCount: 0
      };
    }
  }
};

// Import here to avoid circular dependency
import { CacheUtils } from '@/lib/utils/cache';