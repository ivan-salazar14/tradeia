import { APIError, ErrorFactory, Logger, formatErrorResponse } from '../error-handler';

describe('Error Handler', () => {
  describe('APIError', () => {
    it('should create APIError with correct properties', () => {
      const error = new APIError('Test error', 'VALIDATION_ERROR', 400, true, { field: 'email' });

      expect(error.message).toBe('Test error');
      expect(error.type).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error.details).toEqual({ field: 'email' });
    });
  });

  describe('ErrorFactory', () => {
    it('should create validation error', () => {
      const error = ErrorFactory.validation('Invalid input', { field: 'email' });

      expect(error.message).toBe('Invalid input');
      expect(error.type).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual({ field: 'email' });
    });

    it('should create authentication error', () => {
      const error = ErrorFactory.authentication('Invalid token');

      expect(error.message).toBe('Invalid token');
      expect(error.type).toBe('AUTHENTICATION_ERROR');
      expect(error.statusCode).toBe(401);
    });

    it('should create not found error', () => {
      const error = ErrorFactory.notFound('User');

      expect(error.message).toBe('User not found');
      expect(error.type).toBe('NOT_FOUND');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('formatErrorResponse', () => {
    it('should format APIError correctly', () => {
      const apiError = ErrorFactory.validation('Invalid email');
      const response = formatErrorResponse(apiError);

      expect(response.success).toBe(false);
      expect(response.error.type).toBe('VALIDATION_ERROR');
      expect(response.error.message).toBe('Invalid email');
      expect(response).toHaveProperty('timestamp');
    });

    it('should format generic Error correctly', () => {
      const error = new Error('Generic error');
      const response = formatErrorResponse(error);

      expect(response.success).toBe(false);
      expect(response.error.type).toBe('INTERNAL_ERROR');
      expect(response.error.message).toBe('Generic error');
    });
  });

  describe('Logger', () => {
    // Mock console methods for testing
    const originalConsole = { ...console };
    let consoleOutput: string[] = [];

    beforeEach(() => {
      consoleOutput = [];
      console.log = jest.fn((...args) => {
        consoleOutput.push(args.join(' '));
      });
      console.warn = jest.fn((...args) => {
        consoleOutput.push(args.join(' '));
      });
      console.error = jest.fn((...args) => {
        consoleOutput.push(args.join(' '));
      });
    });

    afterEach(() => {
      Object.assign(console, originalConsole);
    });

    it('should log info messages', () => {
      Logger.info('Test info message', { data: 'test' });

      expect(console.log).toHaveBeenCalled();
      expect(consoleOutput.length).toBeGreaterThan(0);
    });

    it('should log error messages with details', () => {
      const error = new Error('Test error');
      Logger.error('Test error occurred', error, { context: 'test' });

      expect(console.error).toHaveBeenCalled();
    });

    it('should not log debug messages in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      Logger.debug('Debug message');

      // In production, debug should not log
      expect(console.log).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });
});