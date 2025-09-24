import { NextResponse } from 'next/server';

// Error types for better categorization
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  EXTERNAL_API = 'EXTERNAL_API_ERROR',
  DATABASE = 'DATABASE_ERROR',
  INTERNAL = 'INTERNAL_ERROR'
}

// Structured error class
export class APIError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.name = 'APIError';
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error factory functions for common errors
export const ErrorFactory = {
  validation: (message: string, details?: any) =>
    new APIError(message, ErrorType.VALIDATION, 400, true, details),

  authentication: (message: string = 'Authentication required') =>
    new APIError(message, ErrorType.AUTHENTICATION, 401, true),

  authorization: (message: string = 'Insufficient permissions') =>
    new APIError(message, ErrorType.AUTHORIZATION, 403, true),

  notFound: (resource: string = 'Resource') =>
    new APIError(`${resource} not found`, ErrorType.NOT_FOUND, 404, true),

  conflict: (message: string) =>
    new APIError(message, ErrorType.CONFLICT, 409, true),

  rateLimit: (message: string = 'Rate limit exceeded') =>
    new APIError(message, ErrorType.RATE_LIMIT, 429, true),

  externalAPI: (message: string, details?: any) =>
    new APIError(message, ErrorType.EXTERNAL_API, 502, true, details),

  database: (message: string, details?: any) =>
    new APIError(message, ErrorType.DATABASE, 500, false, details),

  internal: (message: string, details?: any) =>
    new APIError(message, ErrorType.INTERNAL, 500, false, details)
};

// Logging levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

// Structured logger
export class Logger {
  private static formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (meta) {
      return `${baseMessage} ${JSON.stringify(meta)}`;
    }

    return baseMessage;
  }

  static debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, meta));
    }
  }

  static info(message: string, meta?: any): void {
    console.info(this.formatMessage(LogLevel.INFO, message, meta));
  }

  static warn(message: string, meta?: any): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, meta));
  }

  static error(message: string, error?: Error | APIError, meta?: any): void {
    const errorMeta = {
      ...meta,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        type: (error as APIError).type,
        statusCode: (error as APIError).statusCode,
        details: (error as APIError).details
      } : undefined
    };

    console.error(this.formatMessage(LogLevel.ERROR, message, errorMeta));
  }
}

// Error response formatter
export function formatErrorResponse(error: APIError | Error): {
  success: false;
  error: {
    type: string;
    message: string;
    details?: any;
  };
  timestamp: string;
} {
  const apiError = error instanceof APIError ? error : ErrorFactory.internal(error.message);

  return {
    success: false,
    error: {
      type: apiError.type,
      message: apiError.message,
      details: process.env.NODE_ENV === 'development' ? apiError.details : undefined
    },
    timestamp: new Date().toISOString()
  };
}

// Global error handler for API routes
export async function handleAPIError(
  error: unknown,
  context?: string
): Promise<NextResponse> {
  let apiError: APIError;

  if (error instanceof APIError) {
    apiError = error;
  } else if (error instanceof Error) {
    // Handle known error types
    if (error.message.includes('JWT') || error.message.includes('auth')) {
      apiError = ErrorFactory.authentication('Invalid or expired token');
    } else if (error.message.includes('not found')) {
      apiError = ErrorFactory.notFound();
    } else if (error.message.includes('rate limit')) {
      apiError = ErrorFactory.rateLimit();
    } else {
      apiError = ErrorFactory.internal(error.message);
    }
  } else {
    apiError = ErrorFactory.internal('An unexpected error occurred');
  }

  // Log the error
  Logger.error(
    `API Error${context ? ` in ${context}` : ''}: ${apiError.message}`,
    apiError
  );

  // Return formatted error response
  return NextResponse.json(
    formatErrorResponse(apiError),
    {
      status: apiError.statusCode,
      headers: {
        'Content-Type': 'application/json',
        'X-Error-Type': apiError.type
      }
    }
  );
}

// Async route wrapper for automatic error handling
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  context?: string
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      Logger.debug(`Starting ${context || 'API request'}`);
      const result = await handler(...args);
      Logger.debug(`Completed ${context || 'API request'} successfully`);
      return result;
    } catch (error) {
      return handleAPIError(error, context);
    }
  };
}

// Validation error formatter
export function formatValidationErrors(errors: any[]): string {
  return errors.map(error => `${error.field}: ${error.message}`).join(', ');
}

// Database error handler
export function handleDatabaseError(error: any): APIError {
  // Handle specific database errors
  if (error.code === '23505') { // Unique constraint violation
    return ErrorFactory.conflict('Resource already exists');
  }

  if (error.code === '23503') { // Foreign key constraint violation
    return ErrorFactory.validation('Referenced resource does not exist');
  }

  if (error.code === '23502') { // Not null constraint violation
    return ErrorFactory.validation('Required field is missing');
  }

  // Generic database error
  return ErrorFactory.database('Database operation failed', {
    code: error.code,
    details: error.message
  });
}