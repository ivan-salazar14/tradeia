import { Logger } from './error-handler';

// Cache entry interface
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
  lastAccessed: number;
}

// Cache configuration
export interface CacheConfig {
  defaultTTL: number;        // Default time-to-live in milliseconds
  maxSize: number;          // Maximum number of entries
  cleanupInterval: number;  // Cleanup interval in milliseconds
}

// Cache statistics
export interface CacheStats {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
  totalRequests: number;
}

// In-memory LRU cache implementation
export class LRUCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder = new Set<string>();
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalRequests: 0
  };

  constructor(private config: CacheConfig) {
    // Start cleanup interval
    setInterval(() => this.cleanup(), config.cleanupInterval);
  }

  // Get value from cache
  get(key: string): T | null {
    this.stats.totalRequests++;

    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
      this.stats.misses++;
      this.stats.evictions++;
      return null;
    }

    // Update access tracking
    entry.hits++;
    entry.lastAccessed = Date.now();
    this.accessOrder.delete(key);
    this.accessOrder.add(key);

    this.stats.hits++;
    return entry.data;
  }

  // Set value in cache
  set(key: string, value: T, ttl?: number): void {
    const actualTTL = ttl ?? this.config.defaultTTL;
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl: actualTTL,
      hits: 0,
      lastAccessed: Date.now()
    };

    // Remove existing entry if present
    if (this.cache.has(key)) {
      this.accessOrder.delete(key);
    }

    // Evict least recently used if at capacity
    if (this.cache.size >= this.config.maxSize) {
      const lruKey = this.accessOrder.values().next().value;
      if (lruKey) {
        this.cache.delete(lruKey);
        this.accessOrder.delete(lruKey);
        this.stats.evictions++;
        Logger.debug(`Cache eviction: ${lruKey}`);
      }
    }

    this.cache.set(key, entry);
    this.accessOrder.add(key);

    Logger.debug(`Cache set: ${key} (TTL: ${actualTTL}ms)`);
  }

  // Delete entry from cache
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.accessOrder.delete(key);
    }
    return deleted;
  }

  // Clear all entries
  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.stats.evictions += this.cache.size;
    Logger.info('Cache cleared');
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return false;
    }

    return true;
  }

  // Get cache statistics
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      evictions: this.stats.evictions,
      totalRequests
    };
  }

  // Get all cache entries (for debugging)
  getAllEntries(): Array<{ key: string; entry: CacheEntry<T> }> {
    return Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      entry
    }));
  }

  // Cleanup expired entries
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => {
      this.cache.delete(key);
      this.accessOrder.delete(key);
    });

    if (expiredKeys.length > 0) {
      this.stats.evictions += expiredKeys.length;
      Logger.debug(`Cache cleanup: ${expiredKeys.length} expired entries removed`);
    }
  }
}

// Global cache instances
const apiResponseCache = new LRUCache({
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 1000,
  cleanupInterval: 60 * 1000 // 1 minute
});

const userDataCache = new LRUCache({
  defaultTTL: 10 * 60 * 1000, // 10 minutes
  maxSize: 500,
  cleanupInterval: 5 * 60 * 1000 // 5 minutes
});

// Cache key generators
export class CacheKeys {
  static signals(params: {
    symbol: string;
    timeframe: string;
    strategyIds?: string[];
    startDate?: string;
    endDate?: string;
  }): string {
    const { symbol, timeframe, strategyIds, startDate, endDate } = params;
    const strategyPart = strategyIds ? `_${strategyIds.sort().join(',')}` : '';
    const datePart = startDate && endDate ? `_${startDate}_${endDate}` : '';
    return `signals:${symbol}:${timeframe}${strategyPart}${datePart}`;
  }

  static userStrategies(userId: string): string {
    return `user_strategies:${userId}`;
  }

  static userProfile(userId: string): string {
    return `user_profile:${userId}`;
  }

  static apiHealth(): string {
    return 'api_health';
  }
}

// Cache decorators
export function cached(ttl?: number) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    const cacheKeyPrefix = `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${cacheKeyPrefix}:${JSON.stringify(args)}`;
      const cachedResult = apiResponseCache.get(cacheKey);

      if (cachedResult !== null) {
        Logger.debug(`Cache hit for ${cacheKey}`);
        return cachedResult;
      }

      Logger.debug(`Cache miss for ${cacheKey}`);
      const result = await method.apply(this, args);
      apiResponseCache.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
}

// Cache utilities
export const CacheUtils = {
  // Get API response cache
  getAPIResponseCache: () => apiResponseCache,

  // Get user data cache
  getUserDataCache: () => userDataCache,

  // Get all cache statistics
  getAllStats: () => ({
    apiResponse: apiResponseCache.getStats(),
    userData: userDataCache.getStats()
  }),

  // Clear all caches
  clearAll: () => {
    apiResponseCache.clear();
    userDataCache.clear();
  },

  // Warm up cache with common data
  async warmup(): Promise<void> {
    Logger.info('Starting cache warmup...');

    // Cache common API health data
    try {
      const healthResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/health`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        apiResponseCache.set(CacheKeys.apiHealth(), healthData, 60 * 1000); // 1 minute
      }
    } catch (error) {
      Logger.warn('Failed to warmup health cache:', error);
    }

    Logger.info('Cache warmup completed');
  }
};

// Conditional caching based on response characteristics
export function shouldCacheResponse(response: Response, data: any): boolean {
  // Don't cache error responses
  if (!response.ok) return false;

  // Don't cache empty responses
  if (!data || (Array.isArray(data) && data.length === 0)) return false;

  // Don't cache responses with no-cache headers
  const cacheControl = response.headers.get('cache-control');
  if (cacheControl?.includes('no-cache') || cacheControl?.includes('no-store')) {
    return false;
  }

  // Cache successful responses with reasonable size
  const contentLength = response.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 1024 * 1024) { // > 1MB
    return false;
  }

  return true;
}