import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Health check response interface
interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: ServiceStatus;
    external_api?: ServiceStatus;
    cache?: ServiceStatus;
  };
  metrics?: {
    response_time_ms: number;
    memory_usage_mb: number;
    active_connections: number;
  };
}

interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  response_time_ms?: number;
  error?: string;
  last_checked: string;
}

// Application start time for uptime calculation
const START_TIME = Date.now();

// Check database connectivity
async function checkDatabaseHealth(): Promise<ServiceStatus> {
  const startTime = Date.now();

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        status: 'down',
        error: 'Supabase configuration missing',
        last_checked: new Date().toISOString()
      };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Simple query to test database connectivity
    const { error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      return {
        status: 'degraded',
        response_time_ms: Date.now() - startTime,
        error: error.message,
        last_checked: new Date().toISOString()
      };
    }

    return {
      status: 'up',
      response_time_ms: Date.now() - startTime,
      last_checked: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      response_time_ms: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      last_checked: new Date().toISOString()
    };
  }
}

// Check external signals API
async function checkExternalAPIHealth(): Promise<ServiceStatus> {
  const startTime = Date.now();
  const apiBase = process.env.SIGNALS_API_BASE;

  if (!apiBase) {
    return {
      status: 'down',
      error: 'External API base URL not configured',
      last_checked: new Date().toISOString()
    };
  }

  try {
    // Try a simple health check endpoint or basic signals request
    const testUrl = `${apiBase}/health` || `${apiBase}/signals?symbol=BTC/USDT&limit=1`;

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'TradeIA-HealthCheck/1.0',
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    if (response.ok) {
      return {
        status: 'up',
        response_time_ms: Date.now() - startTime,
        last_checked: new Date().toISOString()
      };
    } else {
      return {
        status: 'degraded',
        response_time_ms: Date.now() - startTime,
        error: `HTTP ${response.status}`,
        last_checked: new Date().toISOString()
      };
    }
  } catch (error) {
    return {
      status: 'down',
      response_time_ms: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Connection failed',
      last_checked: new Date().toISOString()
    };
  }
}

// Get system metrics
function getSystemMetrics() {
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();

  return {
    response_time_ms: 0, // Will be set by caller
    memory_usage_mb: Math.round(memUsage.heapUsed / 1024 / 1024),
    active_connections: 0, // Would need to track this in a real implementation
    uptime_seconds: Math.round(uptime)
  };
}

// Determine overall health status
function determineOverallStatus(services: HealthStatus['services']): HealthStatus['status'] {
  const serviceStatuses = Object.values(services);

  if (serviceStatuses.some(s => s.status === 'down')) {
    return 'unhealthy';
  }

  if (serviceStatuses.some(s => s.status === 'degraded')) {
    return 'degraded';
  }

  return 'healthy';
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // Run health checks in parallel
    const [dbStatus, externalAPIStatus] = await Promise.all([
      checkDatabaseHealth(),
      checkExternalAPIHealth()
    ]);

    const services = {
      database: dbStatus,
      external_api: externalAPIStatus
    };

    const overallStatus = determineOverallStatus(services);
    const metrics = getSystemMetrics();
    metrics.response_time_ms = Date.now() - startTime;

    const healthResponse: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.round((Date.now() - START_TIME) / 1000),
      version: process.env.npm_package_version || '1.0.0',
      services,
      metrics
    };

    // Return appropriate HTTP status based on health
    const httpStatus = overallStatus === 'healthy' ? 200 :
                      overallStatus === 'degraded' ? 200 : 503; // unhealthy

    return NextResponse.json(healthResponse, {
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/health+json',
        'X-Health-Status': overallStatus
      }
    });

  } catch (error) {
    console.error('Health check failed:', error);

    const errorResponse: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.round((Date.now() - START_TIME) / 1000),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: { status: 'down', error: 'Health check failed', last_checked: new Date().toISOString() },
        external_api: { status: 'down', error: 'Health check failed', last_checked: new Date().toISOString() }
      },
      metrics: getSystemMetrics()
    };

    return NextResponse.json(errorResponse, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/health+json',
        'X-Health-Status': 'unhealthy'
      }
    });
  }
}

// Detailed health check with more metrics
export async function POST(request: NextRequest): Promise<NextResponse> {
  // For detailed health checks, you might want authentication
  // For now, just return the same as GET but with more details

  const response = await GET(request);

  // Add additional detailed metrics for POST requests
  if (response.status === 200) {
    const data = await response.json();

    // Add more detailed service information
    data.services.database.details = {
      connection_pool_size: 10, // Example
      active_connections: 2,
      idle_connections: 8
    };

    return NextResponse.json(data, {
      headers: response.headers
    });
  }

  return response;
}