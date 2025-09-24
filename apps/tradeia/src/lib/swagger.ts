import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TradeIA API',
      version: '2.0.0',
      description: 'API para el sistema de trading automatizado TradeIA',
      contact: {
        name: 'TradeIA Support',
        email: 'support@tradeia.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://api.tradeia.com'
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API Key for external integrations'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  example: 'VALIDATION_ERROR'
                },
                message: {
                  type: 'string',
                  example: 'Invalid input parameters'
                },
                details: {
                  type: 'object',
                  description: 'Additional error details (development only)'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        HealthStatus: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['healthy', 'degraded', 'unhealthy'],
              example: 'healthy'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            uptime: {
              type: 'number',
              description: 'Uptime in seconds',
              example: 3600
            },
            version: {
              type: 'string',
              example: '2.0.0'
            },
            services: {
              type: 'object',
              properties: {
                database: {
                  $ref: '#/components/schemas/ServiceStatus'
                },
                external_api: {
                  $ref: '#/components/schemas/ServiceStatus'
                }
              }
            },
            metrics: {
              type: 'object',
              properties: {
                response_time_ms: {
                  type: 'number',
                  example: 150
                },
                memory_usage_mb: {
                  type: 'number',
                  example: 256
                },
                active_connections: {
                  type: 'number',
                  example: 10
                }
              }
            }
          }
        },
        ServiceStatus: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['up', 'down', 'degraded'],
              example: 'up'
            },
            response_time_ms: {
              type: 'number',
              example: 200
            },
            error: {
              type: 'string',
              example: 'Connection timeout'
            },
            last_checked: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Signal: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'sig_abc123'
            },
            symbol: {
              type: 'string',
              example: 'BTC/USDT',
              pattern: '^[A-Z0-9]+/[A-Z0-9]+$'
            },
            timeframe: {
              type: 'string',
              example: '4h',
              enum: ['1m', '5m', '15m', '1h', '4h', '1d', '1w']
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            execution_timestamp: {
              type: 'string',
              format: 'date-time'
            },
            signal_age_hours: {
              type: 'number',
              example: 2
            },
            signal_source: {
              type: 'string',
              example: 'external_api'
            },
            type: {
              type: 'string',
              enum: ['entry', 'exit', 'update'],
              example: 'entry'
            },
            direction: {
              type: 'string',
              enum: ['BUY', 'SELL', 'LONG', 'SHORT'],
              example: 'BUY'
            },
            strategyId: {
              type: 'string',
              example: 'moderate'
            },
            entry: {
              type: 'number',
              example: 50000
            },
            tp1: {
              type: 'number',
              example: 51000
            },
            tp2: {
              type: 'number',
              example: 52000
            },
            stopLoss: {
              type: 'number',
              example: 49000
            },
            position_size: {
              type: 'number',
              example: 0.002
            },
            risk_amount: {
              type: 'number',
              example: 100
            },
            reward_to_risk: {
              type: 'number',
              example: 2.0
            },
            source: {
              type: 'object',
              properties: {
                provider: {
                  type: 'string',
                  example: 'external_provider'
                }
              }
            }
          }
        },
        Strategy: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'moderate'
            },
            name: {
              type: 'string',
              example: 'Moderate Strategy'
            },
            description: {
              type: 'string',
              example: 'Balanced risk strategy with multiple indicators'
            },
            risk_level: {
              type: 'string',
              enum: ['Low', 'Medium', 'High'],
              example: 'Medium'
            },
            timeframe: {
              type: 'string',
              example: '1h'
            },
            indicators: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['SMA', 'RSI', 'MACD']
            },
            is_active: {
              type: 'boolean',
              example: true
            }
          }
        },
        PortfolioMetrics: {
          type: 'object',
          properties: {
            total_position_size: {
              type: 'number',
              example: 1500.50
            },
            total_risk_amount: {
              type: 'number',
              example: 300.00
            },
            remaining_balance: {
              type: 'number',
              example: 9700.00
            },
            avg_reward_to_risk: {
              type: 'number',
              example: 1.8
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              example: 150
            },
            limit: {
              type: 'number',
              example: 50
            },
            offset: {
              type: 'number',
              example: 0
            },
            current_page: {
              type: 'number',
              example: 1
            },
            total_pages: {
              type: 'number',
              example: 3
            },
            has_next: {
              type: 'boolean',
              example: true
            },
            has_prev: {
              type: 'boolean',
              example: false
            }
          }
        }
      },
      parameters: {
        SymbolParam: {
          name: 'symbol',
          in: 'query',
          description: 'Trading pair symbol (e.g., BTC/USDT)',
          required: false,
          schema: {
            type: 'string',
            pattern: '^[A-Z0-9]+/[A-Z0-9]+$',
            default: 'BTC/USDT'
          }
        },
        TimeframeParam: {
          name: 'timeframe',
          in: 'query',
          description: 'Chart timeframe',
          required: false,
          schema: {
            type: 'string',
            enum: ['1m', '5m', '15m', '1h', '4h', '1d', '1w'],
            default: '4h'
          }
        },
        StrategyIdParam: {
          name: 'strategy_id',
          in: 'query',
          description: 'Specific strategy ID to filter by',
          required: false,
          schema: {
            type: 'string'
          }
        },
        StrategyIdsParam: {
          name: 'strategy_ids',
          in: 'query',
          description: 'Comma-separated list of strategy IDs',
          required: false,
          schema: {
            type: 'string'
          }
        },
        StartDateParam: {
          name: 'start_date',
          in: 'query',
          description: 'Start date for filtering (YYYY-MM-DD)',
          required: false,
          schema: {
            type: 'string',
            format: 'date'
          }
        },
        EndDateParam: {
          name: 'end_date',
          in: 'query',
          description: 'End date for filtering (YYYY-MM-DD)',
          required: false,
          schema: {
            type: 'string',
            format: 'date'
          }
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Maximum number of results to return',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 200,
            default: 50
          }
        },
        OffsetParam: {
          name: 'offset',
          in: 'query',
          description: 'Number of results to skip',
          required: false,
          schema: {
            type: 'integer',
            minimum: 0,
            default: 0
          }
        },
        InitialBalanceParam: {
          name: 'initial_balance',
          in: 'query',
          description: 'Initial portfolio balance for calculations',
          required: false,
          schema: {
            type: 'number',
            minimum: 0,
            default: 10000
          }
        },
        RiskPerTradeParam: {
          name: 'risk_per_trade',
          in: 'query',
          description: 'Risk per trade as percentage',
          required: false,
          schema: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            default: 1.0
          }
        },
        IncludeLiveSignalsParam: {
          name: 'include_live_signals',
          in: 'query',
          description: 'Include live trading signals',
          required: false,
          schema: {
            type: 'boolean',
            default: false
          }
        },
        ForceFreshParam: {
          name: 'force_fresh',
          in: 'query',
          description: 'Force fresh data from external APIs',
          required: false,
          schema: {
            type: 'boolean',
            default: false
          }
        },
        FieldsParam: {
          name: 'fields',
          in: 'query',
          description: 'Comma-separated list of fields to include',
          required: false,
          schema: {
            type: 'string'
          }
        },
        ApiVersionHeader: {
          name: 'x-api-version',
          in: 'header',
          description: 'API version to use',
          required: false,
          schema: {
            type: 'string',
            enum: ['v1', 'v2'],
            default: 'v2'
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Bad Request - Invalid input parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        Unauthorized: {
          description: 'Unauthorized - Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  type: 'AUTHENTICATION_ERROR',
                  message: 'Authentication required'
                },
                timestamp: '2024-01-01T00:00:00.000Z'
              }
            }
          }
        },
        Forbidden: {
          description: 'Forbidden - Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFound: {
          description: 'Not Found - Resource does not exist',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        TooManyRequests: {
          description: 'Too Many Requests - Rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          },
          headers: {
            'Retry-After': {
              description: 'Number of seconds to wait before retrying',
              schema: {
                type: 'integer'
              }
            },
            'X-RateLimit-Limit': {
              description: 'Maximum number of requests allowed per time window',
              schema: {
                type: 'integer'
              }
            },
            'X-RateLimit-Remaining': {
              description: 'Number of requests remaining in current time window',
              schema: {
                type: 'integer'
              }
            },
            'X-RateLimit-Reset': {
              description: 'Time when the rate limit resets (Unix timestamp)',
              schema: {
                type: 'integer'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ServiceUnavailable: {
          description: 'Service Unavailable - External service temporarily unavailable',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/app/api/**/*.ts', './src/app/api/**/*.js'] // Path to API files
};

export const specs = swaggerJSDoc(options);