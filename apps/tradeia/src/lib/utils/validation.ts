import Joi from 'joi';
import { ErrorFactory } from './error-handler';

// Common validation schemas
export const ValidationSchemas = {
  // User authentication
  login: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required'
      })
  }),

  // Signals API
  signalsQuery: Joi.object({
    symbol: Joi.string()
      .pattern(/^[A-Z0-9]+\/[A-Z0-9]+$/)
      .optional()
      .default('BTC/USDT')
      .messages({
        'string.pattern.base': 'Symbol must be in format BASE/QUOTE (e.g., BTC/USDT)'
      }),
    timeframe: Joi.string()
      .pattern(/^(\d+[mhdw]|1m|5m|15m|1h|4h|1d|1w)$/i)
      .messages({
        'string.pattern.base': 'Invalid timeframe format'
      }),
    strategy_id: Joi.string().trim(),
    strategy_ids: Joi.string(), // Will be split and validated separately
    start_date: Joi.string().custom((value, helpers) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return helpers.error('date.invalid');
      }
      return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    }).messages({
      'date.invalid': 'start_date must be a valid date'
    }),
    end_date: Joi.string().custom((value, helpers) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return helpers.error('date.invalid');
      }
      return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    }).messages({
      'date.invalid': 'end_date must be a valid date'
    }),
    limit: Joi.number().integer().min(1).max(200).default(50),
    offset: Joi.number().integer().min(0).default(0),
    initial_balance: Joi.number().positive().default(10000),
    risk_per_trade: Joi.number().positive().max(100).default(1.0),
    include_live_signals: Joi.boolean().default(false),
    force_fresh: Joi.boolean().default(false),
    fields: Joi.string() // Will be split and validated separately
  }),

  // Signal generation
  generateSignals: Joi.object({
    symbol: Joi.string()
      .pattern(/^[A-Z0-9]+\/[A-Z0-9]+$/)
      .default('BTC/USDT')
      .messages({
        'string.pattern.base': 'Symbol must be in format BASE/QUOTE (e.g., BTC/USDT)'
      }),
    timeframe: Joi.string()
      .pattern(/^(\d+[mhdw]|1m|5m|15m|1h|4h|1d|1w)$/i)
      .default('4h')
      .messages({
        'string.pattern.base': 'Invalid timeframe format'
      }),
    start_date: Joi.string().custom((value, helpers) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return helpers.error('date.invalid');
      }
      return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    }).messages({
      'date.invalid': 'start_date must be a valid date'
    }),
    end_date: Joi.string().custom((value, helpers) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return helpers.error('date.invalid');
      }
      return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    }).messages({
      'date.invalid': 'end_date must be a valid date'
    }),
    initial_balance: Joi.number().positive().default(10000),
    risk_per_trade: Joi.number().positive().max(100).default(1.0)
  }),

  // Notification preferences
  notificationPreferences: Joi.object({
    email_notifications: Joi.boolean(),
    push_notifications: Joi.boolean(),
    signal_alerts: Joi.boolean(),
    system_alerts: Joi.boolean(),
    marketing_emails: Joi.boolean()
  }),

  // Strategy creation/update
  strategy: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    description: Joi.string().trim().max(500),
    risk_level: Joi.string().valid('Low', 'Medium', 'High').required(),
    timeframe: Joi.string()
      .pattern(/^(\d+[mhdw]|1m|5m|15m|1h|4h|1d|1w)$/i)
      .required(),
    indicators: Joi.array().items(Joi.string().trim()).min(1).required(),
    is_active: Joi.boolean().default(true),
    parameters: Joi.object().pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/, Joi.alternatives().try(
      Joi.string(),
      Joi.number(),
      Joi.boolean()
    ))
  }),

  // API key management
  apiKey: Joi.object({
    name: Joi.string().trim().min(1).max(50).required(),
    description: Joi.string().trim().max(200),
    permissions: Joi.array().items(
      Joi.string().valid('read', 'write', 'delete', 'admin')
    ).default(['read']),
    expires_at: Joi.date().greater('now')
  })
};

// Validation function with detailed error formatting
export function validateInput<T>(
  data: any,
  schema: Joi.ObjectSchema<T>
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => {
        const field = detail.path.join('.');
        return `${field}: ${detail.message}`;
      });

      return { success: false, errors };
    }

    return { success: true, data: value };
  } catch (err) {
    return {
      success: false,
      errors: ['Validation processing failed']
    };
  }
}

// Sanitization functions
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[^\w\s@.:-]/g, '') // Remove special characters except common ones (added : for ISO dates)
    .trim();
}

export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';

  // Basic HTML sanitization - remove dangerous tags
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '')
    .trim();
}

export function sanitizeSql(input: string): string {
  if (typeof input !== 'string') return '';

  // Remove potentially dangerous SQL characters/patterns
  return input
    .replace(/['";\\]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\b(union|select|insert|update|delete|drop|create|alter)\b/gi, '')
    .trim();
}

// Validate and sanitize query parameters
export function validateQueryParams(
  searchParams: URLSearchParams,
  schema: Joi.ObjectSchema
): { success: true; data: any } | { success: false; errors: string[] } {
  const params: Record<string, any> = {};

  // Convert URLSearchParams to object
  for (const [key, value] of searchParams.entries()) {
    // Handle array parameters (like strategy_ids=1,2,3)
    if (value.includes(',')) {
      params[key] = value.split(',').map(v => v.trim());
    } else if (value === 'true') {
      params[key] = true;
    } else if (value === 'false') {
      params[key] = false;
    } else if (!isNaN(Number(value))) {
      params[key] = Number(value);
    } else {
      params[key] = sanitizeString(value);
    }
  }

  return validateInput(params, schema);
}

// Middleware for request validation
export function createValidationMiddleware(schema: Joi.ObjectSchema) {
  return async (request: Request) => {
    try {
      let dataToValidate: any;

      if (request.method === 'GET') {
        const url = new URL(request.url);
        const validation = validateQueryParams(url.searchParams, schema);
        if (!validation.success) {
          throw ErrorFactory.validation(
            'Invalid query parameters: ' + validation.errors.join(', ')
          );
        }
        dataToValidate = validation.data;
      } else {
        const body = await request.json();
        const validation = validateInput(body, schema);
        if (!validation.success) {
          throw ErrorFactory.validation(
            'Invalid request body: ' + validation.errors.join(', ')
          );
        }
        dataToValidate = validation.data;
      }

      // Add validated data to request for use in handlers
      (request as any).validatedData = dataToValidate;

      return { success: true, data: dataToValidate };
    } catch (error) {
      return { success: false, error };
    }
  };
}