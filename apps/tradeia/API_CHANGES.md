# 🔄 **Cambios en la API para Servicios Externos**

## Resumen Ejecutivo

Las mejoras implementadas en TradeIA han transformado significativamente la API, haciendo que sea más segura, robusta y escalable. Esta documentación detalla los cambios críticos que afectan a servicios externos que consumen la API.

---

## 🔐 **1. Autenticación JWT Obligatoria**

### **Antes (Sin Autenticación)**
```bash
curl -X GET "https://api.tradeia.com/signals"
```

### **Ahora (JWT Requerido)**
```bash
curl -X GET "https://api.tradeia.com/api/v2/signals" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### **Impacto en Servicios Externos**

#### **🔑 Gestión de Tokens**
```javascript
// Ejemplo: Cliente JavaScript
class TradeIAClient {
  constructor() {
    this.baseURL = 'https://api.tradeia.com/api/v2';
    this.token = null;
  }

  async authenticate(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    this.token = data.session.access_token;

    // Programar refresh automático
    this.scheduleTokenRefresh(data.session.expires_in);
  }

  async scheduleTokenRefresh(expiresIn) {
    setTimeout(async () => {
      await this.refreshToken();
    }, (expiresIn - 300) * 1000); // Refresh 5 min antes
  }

  async refreshToken() {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    const data = await response.json();
    this.token = data.access_token;
    this.scheduleTokenRefresh(data.expires_in);
  }

  async apiCall(endpoint, options = {}) {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    return fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
  }
}
```

#### **🚨 Manejo de Errores de Autenticación**
```javascript
// Respuesta de error de autenticación
{
  "success": false,
  "error": {
    "type": "AUTHENTICATION_ERROR",
    "message": "Token expired",
    "code": 401,
    "details": {
      "action_required": "refresh_token"
    }
  }
}

// Manejo en cliente
async function handleAuthError(error) {
  if (error.code === 401) {
    if (error.details?.action_required === 'refresh_token') {
      await client.refreshToken();
      // Retry original request
      return client.apiCall(originalEndpoint, originalOptions);
    } else {
      // Re-authenticate
      await client.authenticate(username, password);
      return client.apiCall(originalEndpoint, originalOptions);
    }
  }
}
```

---

## 📊 **2. Rate Limiting Estructurado**

### **Límites por Endpoint**

```javascript
const RATE_LIMITS = {
  // Endpoints públicos
  health: { requests: 1000, window: '1m' },
  docs: { requests: 500, window: '1m' },

  // Endpoints autenticados
  signals: { requests: 100, window: '1m' },
  'signals/generate': { requests: 50, window: '1m' },
  backtest: { requests: 10, window: '1m' },
  strategies: { requests: 200, window: '1m' },

  // Endpoints administrativos
  admin: { requests: 50, window: '1m' }
};
```

### **Headers de Rate Limit**

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1642240260
X-RateLimit-Window: 60
```

### **Implementación de Exponential Backoff**

```javascript
class RateLimitedClient {
  constructor() {
    this.retryDelays = [1000, 2000, 4000, 8000, 16000]; // Exponential backoff
    this.requestQueue = [];
    this.processing = false;
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(endpoint, options);

      // Check rate limit headers
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const reset = response.headers.get('X-RateLimit-Reset');

      if (response.status === 429) {
        // Rate limited - implement backoff
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : this.getBackoffDelay();

        console.log(`Rate limited. Retrying in ${delay}ms`);
        await this.delay(delay);
        return this.makeRequest(endpoint, options);
      }

      // Update rate limit awareness
      if (remaining && parseInt(remaining) < 10) {
        console.warn(`Rate limit warning: ${remaining} requests remaining`);
      }

      return response;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        // Network error - retry with backoff
        const delay = this.getBackoffDelay();
        console.log(`Network error. Retrying in ${delay}ms`);
        await this.delay(delay);
        return this.makeRequest(endpoint, options);
      }
      throw error;
    }
  }

  getBackoffDelay() {
    const attempt = Math.min(this.retryDelays.length - 1, this.currentAttempt || 0);
    return this.retryDelays[attempt] + Math.random() * 1000; // Add jitter
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

---

## 🛡️ **3. Headers de Seguridad**

### **Headers de Respuesta**

```http
HTTP/1.1 200 OK
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Request-ID: req_1642240200.123
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### **Uso del X-Request-ID**

```javascript
// Logging con request ID para debugging
async function apiCall(endpoint, options = {}) {
  const response = await fetch(endpoint, options);
  const requestId = response.headers.get('X-Request-ID');

  if (!response.ok) {
    console.error(`API Error [${requestId}]:`, {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      requestId
    });

    // Report error to monitoring service
    reportError({
      requestId,
      endpoint,
      error: await response.text(),
      timestamp: new Date().toISOString()
    });
  }

  return response;
}
```

---

## ✅ **4. Validación de Input Estricta**

### **Validaciones por Campo**

```javascript
const VALIDATIONS = {
  symbol: {
    pattern: /^[A-Z0-9]+\/[A-Z0-9]+$/,
    example: 'BTC/USDT',
    error: 'Symbol must be in format BASE/QUOTE'
  },

  timeframe: {
    allowed: ['1m', '5m', '15m', '1h', '4h', '1d', '1w'],
    example: '4h',
    error: 'Invalid timeframe'
  },

  initial_balance: {
    min: 100,
    max: 10000000,
    example: 10000,
    error: 'Balance must be between 100 and 10M'
  },

  risk_per_trade: {
    min: 0.1,
    max: 5.0,
    example: 1.0,
    error: 'Risk per trade must be between 0.1% and 5%'
  },

  limit: {
    min: 1,
    max: 1000,
    default: 50,
    example: 100,
    error: 'Limit must be between 1 and 1000'
  }
};
```

### **Cliente con Validación Previa**

```javascript
class ValidatedTradeIAClient extends TradeIAClient {
  validateSignalRequest(params) {
    const errors = [];

    // Symbol validation
    if (!VALIDATIONS.symbol.pattern.test(params.symbol)) {
      errors.push(VALIDATIONS.symbol.error);
    }

    // Timeframe validation
    if (!VALIDATIONS.timeframe.allowed.includes(params.timeframe)) {
      errors.push(VALIDATIONS.timeframe.error);
    }

    // Balance validation
    if (params.initial_balance < VALIDATIONS.initial_balance.min ||
        params.initial_balance > VALIDATIONS.initial_balance.max) {
      errors.push(VALIDATIONS.initial_balance.error);
    }

    // Risk validation
    if (params.risk_per_trade < VALIDATIONS.risk_per_trade.min ||
        params.risk_per_trade > VALIDATIONS.risk_per_trade.max) {
      errors.push(VALIDATIONS.risk_per_trade.error);
    }

    if (errors.length > 0) {
      throw new ValidationError('Invalid request parameters', errors);
    }

    return params;
  }

  async generateSignals(params) {
    // Validate before sending
    const validatedParams = this.validateSignalRequest(params);

    return this.apiCall('/signals/generate', {
      method: 'POST',
      body: JSON.stringify(validatedParams)
    });
  }
}
```

---

## 📋 **5. Manejo de Errores Estandarizado**

### **Estructura de Error Completa**

```json
{
  "success": false,
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "code": 400,
    "details": {
      "field": "symbol",
      "validation_errors": [
        {
          "field": "symbol",
          "message": "Symbol must be in format BASE/QUOTE (e.g., BTC/USDT)",
          "type": "pattern_error",
          "value": "btc/usdt"
        }
      ],
      "request_params": {
        "symbol": "btc/usdt",
        "timeframe": "4h"
      }
    },
    "timestamp": "2024-01-15T10:30:00.123Z",
    "request_id": "req_1642240200.123",
    "path": "/api/v2/signals/generate",
    "method": "POST",
    "user_agent": "TradeIA-Client/1.0.0",
    "ip": "192.168.1.100"
  }
}
```

### **Códigos de Error y Manejo**

```javascript
const ERROR_HANDLERS = {
  // Errores de autenticación
  AUTHENTICATION_ERROR: (error) => {
    console.error('Authentication failed:', error.message);
    // Trigger re-authentication flow
    return handleReAuthentication();
  },

  // Errores de autorización
  AUTHORIZATION_ERROR: (error) => {
    console.error('Access denied:', error.message);
    // Show permission error to user
    return showPermissionError(error.details);
  },

  // Errores de validación
  VALIDATION_ERROR: (error) => {
    console.error('Validation failed:', error.details.validation_errors);
    // Highlight invalid fields in UI
    return highlightValidationErrors(error.details.validation_errors);
  },

  // Rate limiting
  RATE_LIMIT_ERROR: (error) => {
    const retryAfter = error.details?.retry_after || 60;
    console.warn(`Rate limited. Retry after ${retryAfter}s`);
    // Implement exponential backoff
    return delay(retryAfter * 1000).then(() => retryRequest());
  },

  // Errores del servidor
  DATABASE_ERROR: (error) => {
    console.error('Database error:', error.message);
    // Log for monitoring
    reportToMonitoring(error);
    // Show user-friendly message
    return showGenericError('Service temporarily unavailable');
  },

  // Errores de red/APIs externas
  EXTERNAL_API_ERROR: (error) => {
    console.error('External API error:', error.details);
    // Check circuit breaker status
    if (error.details?.circuit_breaker === 'open') {
      return showServiceUnavailableError();
    }
    // Retry with backoff
    return retryWithBackoff();
  }
};

async function handleAPIError(response) {
  if (!response.ok) {
    const errorData = await response.json();

    const handler = ERROR_HANDLERS[errorData.error.type];
    if (handler) {
      return handler(errorData.error);
    } else {
      // Generic error handling
      console.error('Unhandled error:', errorData);
      return showGenericError(errorData.error.message);
    }
  }

  return response.json();
}
```

---

## 🔄 **6. API Versioning**

### **Versiones Disponibles**

```javascript
const API_VERSIONS = {
  v1: {
    deprecated: true,
    sunset: '2024-06-01',
    changes: ['Limited error details', 'No pagination', 'Basic validation']
  },
  v2: {
    current: true,
    features: [
      'Detailed error responses',
      'Pagination support',
      'Advanced validation',
      'Rate limiting headers',
      'Request IDs',
      'Circuit breaker status'
    ]
  }
};
```

### **Migración Automática**

```javascript
class VersionAwareClient extends TradeIAClient {
  constructor(preferredVersion = 'v2') {
    super();
    this.preferredVersion = preferredVersion;
    this.supportedVersions = ['v1', 'v2'];
  }

  async apiCall(endpoint, options = {}) {
    // Try preferred version first
    let url = `/api/${this.preferredVersion}${endpoint}`;

    try {
      const response = await super.apiCall(url, options);

      // Check if version is deprecated
      const deprecation = response.headers.get('X-API-Deprecated');
      if (deprecation) {
        console.warn(`API version ${this.preferredVersion} is deprecated: ${deprecation}`);
      }

      return response;
    } catch (error) {
      if (error.status === 404 && this.preferredVersion !== 'v1') {
        // Fallback to v1
        console.warn(`Version ${this.preferredVersion} not available, falling back to v1`);
        url = `/api/v1${endpoint}`;
        return super.apiCall(url, options);
      }
      throw error;
    }
  }
}
```

---

## 📊 **7. Monitoreo y Health Checks**

### **Health Check Response**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.123Z",
  "version": "2.1.0",
  "uptime": 86400,
  "services": {
    "database": {
      "status": "up",
      "response_time_ms": 45,
      "last_checked": "2024-01-15T10:30:00.123Z"
    },
    "external_api": {
      "status": "up",
      "response_time_ms": 234,
      "last_checked": "2024-01-15T10:29:55.123Z"
    },
    "cache": {
      "status": "up",
      "response_time_ms": 12,
      "last_checked": "2024-01-15T10:30:00.123Z"
    }
  },
  "metrics": {
    "response_time_ms": 89,
    "memory_usage_mb": 245,
    "active_connections": 12,
    "queue_size": 3
  }
}
```

### **Circuit Breaker Status**

```javascript
// Check circuit breaker status before making requests
async function checkServiceHealth() {
  try {
    const health = await fetch('/api/health');
    const data = await health.json();

    // Check if any service is down
    const unhealthyServices = Object.entries(data.services)
      .filter(([_, service]) => service.status !== 'up')
      .map(([name, service]) => ({ name, ...service }));

    if (unhealthyServices.length > 0) {
      console.warn('Services with issues:', unhealthyServices);
      // Implement fallback logic or show user warning
    }

    return data.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

// Use in client
class ResilientClient extends TradeIAClient {
  async apiCall(endpoint, options = {}) {
    // Check health before making request
    const isHealthy = await checkServiceHealth();
    if (!isHealthy) {
      throw new Error('Service is currently unavailable');
    }

    return super.apiCall(endpoint, options);
  }
}
```

---

## 🚀 **8. Mejores Prácticas para Servicios Externos**

### **Configuración del Cliente**

```javascript
const clientConfig = {
  baseURL: 'https://api.tradeia.com/api/v2',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  rateLimit: {
    requests: 100,
    window: 60000 // 1 minute
  },
  circuitBreaker: {
    failureThreshold: 5,
    recoveryTimeout: 30000,
    monitoringPeriod: 60000
  }
};

class ProductionReadyClient extends TradeIAClient {
  constructor(config = clientConfig) {
    super();
    this.config = config;
    this.requestQueue = [];
    this.processing = false;
  }

  // Implement queue for rate limiting
  async enqueueRequest(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ endpoint, options, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.requestQueue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.requestQueue.length > 0) {
      const { endpoint, options, resolve, reject } = this.requestQueue.shift();

      try {
        // Rate limiting check
        await this.checkRateLimit();

        const result = await this.makeRequest(endpoint, options);
        resolve(result);
      } catch (error) {
        reject(error);
      }

      // Small delay between requests
      await this.delay(100);
    }

    this.processing = false;
  }

  async checkRateLimit() {
    // Implement rate limiting logic
    const now = Date.now();
    const windowStart = now - this.config.rateLimit.window;

    // Clean old requests
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => timestamp > windowStart
    );

    if (this.requestTimestamps.length >= this.config.rateLimit.requests) {
      const oldestRequest = Math.min(...this.requestTimestamps);
      const waitTime = this.config.rateLimit.window - (now - oldestRequest);

      if (waitTime > 0) {
        await this.delay(waitTime);
      }
    }

    this.requestTimestamps.push(now);
  }

  async makeRequest(endpoint, options = {}) {
    let lastError;

    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(`${this.config.baseURL}${endpoint}`, {
          ...options,
          signal: controller.signal,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'TradeIA-Client/2.0.0'
          }
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          return response;
        }

        // Handle specific error codes
        if (response.status === 401) {
          await this.refreshToken();
          continue; // Retry with new token
        }

        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : this.config.retryDelay * attempt;
          await this.delay(delay);
          continue;
        }

        // Other errors
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      } catch (error) {
        lastError = error;

        if (attempt < this.config.retries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
          await this.delay(delay);
        }
      }
    }

    throw lastError;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

---

## 📋 **Checklist de Migración**

### **Para Servicios Externos**

- [ ] **Implementar autenticación JWT** con refresh tokens
- [ ] **Agregar rate limiting awareness** con exponential backoff
- [ ] **Actualizar validaciones de input** según nuevos requisitos
- [ ] **Implementar manejo de errores estandarizado** por código de error
- [ ] **Agregar logging con request IDs** para debugging
- [ ] **Implementar health checks** antes de hacer requests
- [ ] **Configurar circuit breaker** para resiliencia
- [ ] **Actualizar URLs** a `/api/v2/` endpoints
- [ ] **Agregar monitoring** de latencia y tasa de error
- [ ] **Implementar retry logic** con backoff inteligente

### **Testing de Integración**

- [ ] **Probar autenticación** con tokens válidos/inválidos
- [ ] **Verificar rate limiting** con requests concurrentes
- [ ] **Testear validaciones** con datos válidos/inválidos
- [ ] **Simular errores de red** y verificar recovery
- [ ] **Probar circuit breaker** con servicios caídos
- [ ] **Verificar API versioning** con diferentes versiones

---

## 🎯 **Beneficios de las Mejoras**

### **Para Servicios Externos**
- ✅ **Mayor Seguridad**: Autenticación robusta y validación estricta
- ✅ **Mejor Reliability**: Circuit breakers y retry logic
- ✅ **Mejor Performance**: Caching y rate limiting inteligente
- ✅ **Mejor Debugging**: Request IDs y error details detallados
- ✅ **Future-Proof**: API versioning para evolución gradual

### **Para el Sistema TradeIA**
- ✅ **Escalabilidad**: Arquitectura event-driven y background processing
- ✅ **Monitoreo**: Health checks y métricas completas
- ✅ **Mantenibilidad**: Código modular y testing automatizado
- ✅ **Compliance**: OWASP security standards
- ✅ **Developer Experience**: CI/CD completo y documentación

¡La API de TradeIA ahora ofrece **enterprise-grade reliability y security** para todos los servicios externos! 🚀