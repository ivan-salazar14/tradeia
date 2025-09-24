'use client';

import { useEffect, useState } from 'react';

interface APISpec {
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
}

export default function DocsPage() {
  const [spec, setSpec] = useState<APISpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch('/api/docs');
        if (!response.ok) {
          throw new Error('Failed to fetch API specification');
        }
        const data = await response.json();
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSpec();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const endpoints = spec ? Object.keys(spec.paths) : [];
  const schemas = spec ? Object.keys(spec.components.schemas) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">TradeIA API Documentation</h1>
          <p className="text-gray-600 mt-1">
            Version {spec?.info.version} - {spec?.info.description}
          </p>
          <div className="mt-4 flex gap-4">
            <a
              href="/api/docs"
              target="_blank"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              📄 View OpenAPI JSON
            </a>
            <a
              href="https://swagger.io/tools/swagger-ui/"
              target="_blank"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              🔗 Swagger UI Online
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveSection('overview')}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      activeSection === 'overview'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    📋 Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('endpoints')}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      activeSection === 'endpoints'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    🔗 Endpoints ({endpoints.length})
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('schemas')}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      activeSection === 'schemas'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    📊 Schemas ({schemas.length})
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('auth')}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      activeSection === 'auth'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    🔐 Authentication
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {activeSection === 'overview' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">API Overview</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 mb-4">
                      The TradeIA API provides programmatic access to trading signals, portfolio analytics,
                      and trading strategies. Built with security and performance in mind.
                    </p>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">Key Features</h3>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                      <li>Real-time trading signals generation</li>
                      <li>Portfolio metrics and risk analysis</li>
                      <li>Multiple trading strategies support</li>
                      <li>Comprehensive security measures</li>
                      <li>Rate limiting and circuit breakers</li>
                      <li>API versioning for backward compatibility</li>
                    </ul>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">Base URL</h3>
                    <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                      {process.env.NODE_ENV === 'production'
                        ? 'https://api.tradeia.com'
                        : 'http://localhost:3000'}
                    </code>
                  </div>
                </div>
              )}

              {activeSection === 'endpoints' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">API Endpoints</h2>
                  <div className="space-y-4">
                    {endpoints.map((endpoint) => (
                      <div key={endpoint} className="border border-gray-200 rounded p-4">
                        <h3 className="font-medium text-gray-900 mb-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{endpoint}</code>
                        </h3>
                        <div className="text-sm text-gray-600">
                          {Object.entries(spec!.paths[endpoint]).map(([method, details]: [string, any]) => (
                            <div key={method} className="mb-2">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium mr-2 ${
                                method === 'get' ? 'bg-green-100 text-green-800' :
                                method === 'post' ? 'bg-blue-100 text-blue-800' :
                                method === 'put' ? 'bg-yellow-100 text-yellow-800' :
                                method === 'delete' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {method.toUpperCase()}
                              </span>
                              <span>{details.summary || 'No description'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'schemas' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Schemas</h2>
                  <div className="space-y-4">
                    {schemas.map((schemaName) => (
                      <div key={schemaName} className="border border-gray-200 rounded p-4">
                        <h3 className="font-medium text-gray-900 mb-2">{schemaName}</h3>
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                          {JSON.stringify(spec!.components.schemas[schemaName], null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'auth' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 mb-4">
                      The TradeIA API uses Bearer token authentication. Include the token in the Authorization header.
                    </p>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">Example</h3>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                    </pre>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">Getting a Token</h3>
                    <p className="text-gray-600 mb-2">
                      Tokens are obtained through the login endpoint:
                    </p>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}