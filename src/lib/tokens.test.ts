import { createApiToken, validateToken, revokeToken, listTokens } from './tokens';
import { supabase } from './supabase';

// Mock Supabase client
jest.mock('./supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    is: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  },
}));

describe('Token Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createApiToken', () => {
    it('should create a new API token', async () => {
      // Mock the insert response
      const mockToken = {
        id: 'test-token-id',
        user_id: 'test-user-id',
        description: 'Test Token',
        permissions: ['read'],
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      };

      ((supabase?.from() ?? jest.fn().mockReturnThis()).insert().select().single as unknown as jest.Mock).mockResolvedValue({
        data: mockToken,
        error: null,
      });

      const result = await createApiToken({
        userId: 'test-user-id',
        description: 'Test Token',
        permissions: ['read'],
        expiresInDays: 90,
      });

      // Check that the token was created with the correct data
      expect(supabase.from).toHaveBeenCalledWith('api_tokens');
      expect(supabase.from().insert).toHaveBeenCalled();
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('id', 'test-token-id');
      expect(result).toHaveProperty('description', 'Test Token');
      expect(result.permissions).toEqual(['read']);
    });

    it('should handle errors when creating a token', async () => {
      (supabase.from().insert().select().single as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      await expect(
        createApiToken({
          userId: 'test-user-id',
          description: 'Test Token',
          permissions: ['read'],
          expiresInDays: 90,
        })
      ).rejects.toThrow('Failed to create API token: Database error');
    });
  });

  describe('validateToken', () => {
    it('should validate a valid token', async () => {
      const mockTokenData = {
        id: 'test-token-id',
        user_id: 'test-user-id',
        token_hash: 'hashed-token',
        description: 'Test Token',
        permissions: ['read'],
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        revoked: false,
        last_used_at: null,
      };

      (supabase.from().select().eq().is().single as jest.Mock).mockResolvedValue({
        data: mockTokenData,
        error: null,
      });

      (supabase.from().update().eq as jest.Mock).mockResolvedValue({
        error: null,
      });

      const result = await validateToken('valid-token');

      expect(supabase.from).toHaveBeenCalledWith('api_tokens');
      expect(supabase.from().select).toHaveBeenCalled();
      expect(supabase.from().update).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'test-token-id',
        user_id: 'test-user-id',
        permissions: ['read'],
      });
    });

    it('should return null for an invalid token', async () => {
      (supabase.from().select().eq().is().single as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await validateToken('invalid-token');

      expect(result).toBeNull();
    });

    it('should return null for an expired token', async () => {
      const mockTokenData = {
        id: 'test-token-id',
        user_id: 'test-user-id',
        token_hash: 'hashed-token',
        description: 'Test Token',
        permissions: ['read'],
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Expired
        revoked: false,
        last_used_at: null,
      };

      (supabase.from().select().eq().is().single as jest.Mock).mockResolvedValue({
        data: mockTokenData,
        error: null,
      });

      const result = await validateToken('expired-token');

      expect(result).toBeNull();
    });

    it('should return null for a revoked token', async () => {
      const mockTokenData = {
        id: 'test-token-id',
        user_id: 'test-user-id',
        token_hash: 'hashed-token',
        description: 'Test Token',
        permissions: ['read'],
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        revoked: true, // Revoked
        last_used_at: null,
      };

      (supabase.from().select().eq().is().single as jest.Mock).mockResolvedValue({
        data: mockTokenData,
        error: null,
      });

      const result = await validateToken('revoked-token');

      expect(result).toBeNull();
    });
  });

  describe('revokeToken', () => {
    it('should revoke a token', async () => {
      (supabase.from().update().eq as jest.Mock).mockResolvedValue({
        error: null,
      });

      await revokeToken('test-token-id', 'test-user-id');

      expect(supabase.from).toHaveBeenCalledWith('api_tokens');
      expect(supabase.from().update).toHaveBeenCalledWith({
        revoked: true,
        revoked_at: expect.any(String),
      });
      expect(supabase.from().update().eq).toHaveBeenCalledWith('id', 'test-token-id');
      expect(supabase.from().update().eq).toHaveBeenCalledWith('user_id', 'test-user-id');
    });

    it('should handle errors when revoking a token', async () => {
      (supabase.from().update().eq as jest.Mock).mockResolvedValue({
        error: { message: 'Database error' },
      });

      await expect(
        revokeToken('test-token-id', 'test-user-id')
      ).rejects.toThrow('Failed to revoke token: Database error');
    });
  });

  describe('listTokens', () => {
    it('should list tokens for a user', async () => {
      const mockTokens = [
        {
          id: 'token-1',
          user_id: 'test-user-id',
          description: 'Token 1',
          permissions: ['read'],
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          last_used_at: null,
          revoked: false,
        },
        {
          id: 'token-2',
          user_id: 'test-user-id',
          description: 'Token 2',
          permissions: ['read', 'write'],
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          last_used_at: new Date().toISOString(),
          revoked: false,
        },
      ];

      (supabase.from().select().eq().is().order as jest.Mock).mockResolvedValue({
        data: mockTokens,
        error: null,
      });

      const result = await listTokens('test-user-id');

      expect(supabase.from).toHaveBeenCalledWith('api_tokens');
      expect(supabase.from().select).toHaveBeenCalled();
      expect(supabase.from().select().eq).toHaveBeenCalledWith('user_id', 'test-user-id');
      expect(supabase.from().select().eq().is).toHaveBeenCalledWith('revoked', false);
      expect(result).toEqual([
        {
          id: 'token-1',
          description: 'Token 1',
          permissions: ['read'],
          createdAt: expect.any(String),
          expiresAt: expect.any(String),
          lastUsedAt: null,
        },
        {
          id: 'token-2',
          description: 'Token 2',
          permissions: ['read', 'write'],
          createdAt: expect.any(String),
          expiresAt: expect.any(String),
          lastUsedAt: expect.any(String),
        },
      ]);
    });

    it('should handle errors when listing tokens', async () => {
      (supabase.from().select().eq().is().order as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      await expect(
        listTokens('test-user-id')
      ).rejects.toThrow('Failed to list tokens: Database error');
    });
  });
});