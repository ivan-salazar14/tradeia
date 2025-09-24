import { validateInput, sanitizeString, sanitizeSql, createValidationMiddleware } from '../validation';
import { ValidationSchemas } from '../validation';

describe('Validation Utils', () => {
  describe('validateInput', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = validateInput(validData, ValidationSchemas.login);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      };

      const result = validateInput(invalidData, ValidationSchemas.login);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('email: Please provide a valid email address');
      }
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123'
      };

      const result = validateInput(invalidData, ValidationSchemas.login);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('password: Password must be at least 8 characters long');
      }
    });

    it('should validate valid signal parameters', () => {
      const validData = {
        symbol: 'BTC/USDT',
        timeframe: '4h',
        limit: 50,
        offset: 0
      };

      const result = validateInput(validData, ValidationSchemas.signalsQuery);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.symbol).toBe('BTC/USDT');
      }
    });

    it('should reject invalid symbol format', () => {
      const invalidData = {
        symbol: 'INVALID',
        timeframe: '4h'
      };

      const result = validateInput(invalidData, ValidationSchemas.signalsQuery);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('symbol: Symbol must be in format BASE/QUOTE (e.g., BTC/USDT)');
      }
    });

    it('should validate valid signal parameters with dates', () => {
      const validData = {
        symbol: 'BTC/USDT',
        timeframe: '4h',
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        limit: 50,
        offset: 0
      };

      const result = validateInput(validData, ValidationSchemas.signalsQuery);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.start_date).toBe('2023-01-01');
        expect(result.data.end_date).toBe('2023-12-31');
      }
    });

    it('should accept various date formats', () => {
      const testCases = [
        '2023-01-01',
        '2023/01/01',
        '01-01-2023',
        '01/01/2023',
        '2023-01-01T00:00:00.000Z',
        '2023-01-01T12:30:45'
      ];

      testCases.forEach(dateStr => {
        const validData = {
          symbol: 'BTC/USDT',
          timeframe: '4h',
          start_date: dateStr,
          end_date: dateStr
        };

        const result = validateInput(validData, ValidationSchemas.signalsQuery);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid dates', () => {
      const invalidData = {
        symbol: 'BTC/USDT',
        timeframe: '4h',
        start_date: 'invalid-date',
        end_date: '2023-12-31'
      };

      const result = validateInput(invalidData, ValidationSchemas.signalsQuery);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('start_date: start_date must be a valid date');
      }
    });
  });

  describe('sanitizeString', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script>Hello World';
      const result = sanitizeString(input);
      expect(result).toBe('Hello World');
    });

    it('should remove event handlers', () => {
      const input = '<div onclick="alert(1)">Click me</div>';
      const result = sanitizeString(input);
      expect(result).toBe('Click me');
    });

    it('should handle normal strings', () => {
      const input = 'Normal string with spaces and symbols @#$%^&*()';
      const result = sanitizeString(input);
      expect(result).toBe(input);
    });

    it('should handle empty and null inputs', () => {
      expect(sanitizeString('')).toBe('');
      expect(sanitizeString(null as any)).toBe('');
      expect(sanitizeString(undefined as any)).toBe('');
    });
  });

  describe('sanitizeSql', () => {
    it('should remove dangerous SQL characters', () => {
      const input = "'; DROP TABLE users; --";
      const result = sanitizeSql(input);
      expect(result).toBe(' DROP TABLE users ');
    });

    it('should remove SQL keywords', () => {
      const input = 'SELECT * FROM users UNION SELECT password FROM admin';
      const result = sanitizeSql(input);
      expect(result).toBe(' * FROM users  password FROM admin');
    });

    it('should handle normal inputs', () => {
      const input = 'normal_user_123';
      const result = sanitizeSql(input);
      expect(result).toBe(input);
    });
  });

  describe('createValidationMiddleware', () => {
    it('should create validation middleware', () => {
      const middleware = createValidationMiddleware(ValidationSchemas.login);

      expect(typeof middleware).toBe('function');
    });

    // Note: Full middleware testing would require NextRequest mocking
    // This is tested in integration tests
  });
});