'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Token {
  id: string;
  description: string;
  permissions: string[];
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string | null;
}

interface NewTokenResponse {
  id: string;
  token: string;
  description: string;
  permissions: string[];
  createdAt: string;
  expiresAt: string;
}

export default function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newToken, setNewToken] = useState<NewTokenResponse | null>(null);
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<string[]>(['read']);
  const [expiresInDays, setExpiresInDays] = useState(90);

  // Fetch tokens on component mount
  useEffect(() => {
    fetchTokens();
  }, []);

  // Function to fetch tokens
  const fetchTokens = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/tokens');
      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }

      const data = await response.json();
      setTokens(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new token
  const createToken = async () => {
    try {
      setLoading(true);
      setError(null);
      setNewToken(null);

      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          permissions,
          expiresInDays,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create token');
      }

      const data = await response.json();
      setNewToken(data);
      fetchTokens(); // Refresh the token list
      setDescription(''); // Reset form
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Function to revoke a token
  const revokeToken = async (tokenId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/tokens/${tokenId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to revoke token');
      }

      fetchTokens(); // Refresh the token list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle permission checkbox changes
  const handlePermissionChange = (permission: string) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter(p => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">API Token Management</h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* New token display */}
      {newToken && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold mb-2">New Token Created</h2>
          <p className="mb-2">Copy your token now. You won't be able to see it again!</p>
          <div className="bg-white p-3 rounded border border-green-300 mb-2 break-all font-mono">
            {newToken.token}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(newToken.token)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Copy to Clipboard
          </button>
        </div>
      )}

      {/* Create token form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Token</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Token description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Permissions
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={permissions.includes('read')}
                onChange={() => handlePermissionChange('read')}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">Read</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={permissions.includes('write')}
                onChange={() => handlePermissionChange('write')}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">Write</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={permissions.includes('execute')}
                onChange={() => handlePermissionChange('execute')}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">Execute</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expires">
            Expires In (days)
          </label>
          <select
            id="expires"
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(Number(e.target.value))}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
            <option value={365}>365 days</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={createToken}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Token'}
          </button>
        </div>
      </div>

      {/* Token list */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-semibold mb-4">Your API Tokens</h2>
        {loading && <p>Loading tokens...</p>}
        {!loading && tokens.length === 0 && <p>No tokens found.</p>}
        {!loading && tokens.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Used
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => (
                  <tr key={token.id}>
                    <td className="py-2 px-4 border-b border-gray-200">{token.description}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {token.permissions.join(', ')}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {new Date(token.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {new Date(token.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {token.lastUsedAt
                        ? new Date(token.lastUsedAt).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button
                        onClick={() => revokeToken(token.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}