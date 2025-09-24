import { Logger } from './error-handler';

// Circuit breaker states
export enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Failing, requests rejected
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

// Circuit breaker configuration
export interface CircuitBreakerConfig {
  failureThreshold: number;     // Number of failures before opening
  recoveryTimeout: number;      // Time to wait before trying again (ms)
  monitoringPeriod: number;     // Time window to count failures (ms)
  successThreshold: number;     // Number of successes needed to close circuit
  name: string;                 // Identifier for logging
}

// Circuit breaker statistics
export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailureTime: number | null;
  lastSuccessTime: number | null;
  nextAttemptTime: number | null;
  totalRequests: number;
  totalFailures: number;
  totalSuccesses: number;
}

// Circuit breaker implementation
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private successes: number = 0;
  private lastFailureTime: number | null = null;
  private lastSuccessTime: number | null = null;
  private nextAttemptTime: number | null = null;
  private totalRequests: number = 0;
  private totalFailures: number = 0;
  private totalSuccesses: number = 0;

  constructor(private config: CircuitBreakerConfig) {}

  // Execute a function with circuit breaker protection
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.totalRequests++;

    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN;
        Logger.info(`Circuit breaker ${this.config.name} entering HALF_OPEN state`);
      } else {
        throw new Error(`Circuit breaker ${this.config.name} is OPEN - service unavailable`);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  // Handle successful execution
  private onSuccess(): void {
    this.successes++;
    this.totalSuccesses++;
    this.lastSuccessTime = Date.now();

    if (this.state === CircuitState.HALF_OPEN) {
      if (this.successes >= this.config.successThreshold) {
        this.reset();
      }
    } else {
      // Reset failure count on success in CLOSED state
      this.failures = 0;
    }

    Logger.debug(`Circuit breaker ${this.config.name} success: ${this.successes}/${this.config.successThreshold}`);
  }

  // Handle failed execution
  private onFailure(): void {
    this.failures++;
    this.totalFailures++;
    this.lastFailureTime = Date.now();

    Logger.warn(`Circuit breaker ${this.config.name} failure: ${this.failures}/${this.config.failureThreshold}`);

    if (this.state === CircuitState.HALF_OPEN) {
      // Go back to OPEN state on failure during HALF_OPEN
      this.trip();
    } else if (this.failures >= this.config.failureThreshold) {
      this.trip();
    }
  }

  // Open the circuit
  private trip(): void {
    this.state = CircuitState.OPEN;
    this.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
    Logger.warn(`Circuit breaker ${this.config.name} tripped to OPEN state`);
  }

  // Close the circuit (reset to normal operation)
  private reset(): void {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    this.successes = 0;
    this.nextAttemptTime = null;
    Logger.info(`Circuit breaker ${this.config.name} reset to CLOSED state`);
  }

  // Check if we should attempt to reset the circuit
  private shouldAttemptReset(): boolean {
    return this.nextAttemptTime !== null && Date.now() >= this.nextAttemptTime;
  }

  // Get current statistics
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      nextAttemptTime: this.nextAttemptTime,
      totalRequests: this.totalRequests,
      totalFailures: this.totalFailures,
      totalSuccesses: this.totalSuccesses
    };
  }

  // Manually reset the circuit breaker
  manualReset(): void {
    this.reset();
    Logger.info(`Circuit breaker ${this.config.name} manually reset`);
  }

  // Manually trip the circuit breaker
  manualTrip(): void {
    this.trip();
    Logger.warn(`Circuit breaker ${this.config.name} manually tripped`);
  }

  // Check if circuit is available for requests
  isAvailable(): boolean {
    return this.state === CircuitState.CLOSED ||
           (this.state === CircuitState.HALF_OPEN) ||
           (this.state === CircuitState.OPEN && this.shouldAttemptReset());
  }
}

// Circuit breaker registry for managing multiple breakers
export class CircuitBreakerRegistry {
  private breakers = new Map<string, CircuitBreaker>();

  // Create or get a circuit breaker
  getBreaker(name: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
    if (!this.breakers.has(name)) {
      const defaultConfig: CircuitBreakerConfig = {
        failureThreshold: 5,
        recoveryTimeout: 60000, // 1 minute
        monitoringPeriod: 300000, // 5 minutes
        successThreshold: 3,
        name,
        ...config
      };

      this.breakers.set(name, new CircuitBreaker(defaultConfig));
    }

    return this.breakers.get(name)!;
  }

  // Get all circuit breaker statistics
  getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};

    for (const [name, breaker] of this.breakers) {
      stats[name] = breaker.getStats();
    }

    return stats;
  }

  // Reset all circuit breakers
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.manualReset();
    }
  }
}

// Global registry instance
export const circuitBreakerRegistry = new CircuitBreakerRegistry();

// HTTP client with circuit breaker
export class ProtectedHTTPClient {
  constructor(
    private baseURL: string,
    private breakerName: string,
    private config?: Partial<CircuitBreakerConfig>
  ) {}

  private getBreaker(): CircuitBreaker {
    return circuitBreakerRegistry.getBreaker(this.breakerName, this.config);
  }

  async get(url: string, options?: RequestInit): Promise<Response> {
    const breaker = this.getBreaker();
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    return breaker.execute(async () => {
      Logger.debug(`HTTP GET ${fullURL} via circuit breaker ${this.breakerName}`);

      const response = await fetch(fullURL, {
        method: 'GET',
        headers: {
          'User-Agent': 'TradeIA-ProtectedClient/1.0',
          ...options?.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    });
  }

  async post(url: string, data?: any, options?: RequestInit): Promise<Response> {
    const breaker = this.getBreaker();
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    return breaker.execute(async () => {
      Logger.debug(`HTTP POST ${fullURL} via circuit breaker ${this.breakerName}`);

      const response = await fetch(fullURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TradeIA-ProtectedClient/1.0',
          ...options?.headers
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    });
  }

  getStats(): CircuitBreakerStats {
    return this.getBreaker().getStats();
  }
}

// Create protected client for signals API
export const signalsAPIClient = new ProtectedHTTPClient(
  process.env.SIGNALS_API_BASE || '',
  'signals-api',
  {
    failureThreshold: 3,
    recoveryTimeout: 30000, // 30 seconds
    successThreshold: 2
  }
);