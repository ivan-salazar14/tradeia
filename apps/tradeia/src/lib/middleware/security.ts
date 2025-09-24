import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting store (for development/production use Redis/external service)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // requests per window

// OWASP Security Headers
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
};

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// Input sanitization function
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

// SQL injection prevention
export function sanitizeSqlInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/['";\\]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim();
}

// Rate limiting middleware
export async function rateLimitMiddleware(request: NextRequest): Promise<NextResponse | null> {
  // Get client IP from headers (Next.js doesn't expose request.ip directly)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0] ?? request.headers.get('x-real-ip') ?? '127.0.0.1';
  const identifier = `api:${ip}`;
  const now = Date.now();

  try {
    const entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW
      });
    } else {
      // Increment counter
      entry.count++;

      if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((entry.resetTime - now) / 1000),
            limit: RATE_LIMIT_MAX_REQUESTS,
            remaining: 0
          },
          {
            status: 429,
            headers: {
              'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
              'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': entry.resetTime.toString(),
            }
          }
        );
      }
    }

    // Add rate limit headers to successful responses
    const currentEntry = rateLimitStore.get(identifier)!;
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
    response.headers.set('X-RateLimit-Remaining', (RATE_LIMIT_MAX_REQUESTS - currentEntry.count).toString());
    response.headers.set('X-RateLimit-Reset', currentEntry.resetTime.toString());

    return response;
  } catch (error) {
    console.warn('Rate limiting error:', error);
    // Continue without rate limiting if there's an error
    return NextResponse.next();
  }
}

// Security headers middleware
export function securityHeadersMiddleware(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// CORS middleware
export function corsMiddleware(request: NextRequest, response: NextResponse): NextResponse {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const corsResponse = new NextResponse(null, { status: 200 });
    Object.entries(corsHeaders).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        corsResponse.headers.set(key, value.join(', '));
      } else {
        corsResponse.headers.set(key, value);
      }
    });
    return corsResponse;
  }

  // Add CORS headers to actual responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      response.headers.set(key, value.join(', '));
    } else {
      response.headers.set(key, value);
    }
  });

  return response;
}

// Request validation middleware
export function validateRequestBody(body: any, schema: any): { isValid: boolean; errors?: string[] } {
  try {
    // Basic validation - you can extend this with Joi or similar
    const errors: string[] = [];

    if (!body) {
      errors.push('Request body is required');
      return { isValid: false, errors };
    }

    // Add more validation logic here based on schema

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errors: ['Validation error: ' + (error as Error).message]
    };
  }
}

// Combined security middleware
export async function applySecurityMiddleware(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  // Apply rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request);
  if (rateLimitResponse && rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  // Execute the handler
  const response = await handler();

  // Apply security headers
  const securedResponse = securityHeadersMiddleware(response);

  // Apply CORS headers
  return corsMiddleware(request, securedResponse);
}