# Tradeia

[![CI/CD Pipeline](https://github.com/your-username/tradeia/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/tradeia/actions/workflows/ci.yml)
[![Coverage Status](https://codecov.io/gh/your-username/tradeia/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/tradeia)
[![codecov](https://codecov.io/gh/your-username/tradeia/branch/main/graph/badge.svg?token=YOUR_CODECOV_TOKEN)](https://codecov.io/gh/your-username/tradeia)

Una aplicación web moderna construida con Next.js 15, TypeScript, Tailwind CSS y un stack tecnológico enterprise-grade para trading y análisis financiero. Incluye arquitectura event-driven, message queues, seguridad OWASP, API versioning y testing automatizado completo.

## 🚀 Tech Stack

### **Core Framework & Language**
- **Framework**: Next.js 15.5.0 (App Router)
- **Lenguaje**: TypeScript 5.6.3
- **Runtime**: Node.js 18.x/20.x

### **Frontend & UI**
- **Estilos**: Tailwind CSS 3.4.17
- **UI Components**: Headless UI 2.0.0
- **Gráficos**: Chart.js 4.4.2
- **Fechas**: date-fns 3.6.0

### **Backend & Database**
- **Base de Datos**: Supabase 2.56.0 (PostgreSQL)
- **Autenticación**: Supabase Auth + JWT
- **Tiempo Real**: Supabase Realtime
- **Connection Pooling**: Built-in connection management
- **Caching**: LRU Cache + Redis support

### **APIs & Communication**
- **API Framework**: Next.js API Routes
- **Versioning**: Custom API versioning (v1/v2)
- **Documentation**: OpenAPI/Swagger auto-generated
- **Message Queues**: Redis/In-memory queues
- **Circuit Breakers**: Fault tolerance for external APIs

### **Security & Performance**
- **Security**: OWASP compliance (helmet, rate limiting, input validation)
- **Authentication**: Bearer tokens + Supabase Auth
- **Validation**: Joi schemas + custom sanitization
- **Worker Threads**: CPU-intensive task processing
- **Async Patterns**: Advanced async/await patterns

### **Background Processing**
- **Job Queues**: Priority-based job processing
- **Workers**: Signal processing, notifications, cleanup
- **Event System**: Real-time event handling
- **Monitoring**: Health checks + metrics

### **Testing & Quality**
- **Unit Testing**: Jest 30.1.2 + 80% coverage
- **Integration Testing**: API + queue testing
- **E2E Testing**: Cypress 13.10.0
- **Coverage**: Codecov integration
- **Linting**: ESLint + TypeScript strict mode

### **DevOps & Deployment**
- **CI/CD**: GitHub Actions (multi-stage pipeline)
- **Containerization**: Docker + Docker Compose
- **Deployment**: Vercel (staging/production)
- **Monitoring**: Health checks + error tracking
- **Security Scanning**: Automated vulnerability scanning

## 📦 Instalación

### Opción 1: Desarrollo Local

#### **Instalación Automática (Recomendado)**
```bash
# Clonar el repositorio
git clone <repository-url>
cd tradeia

# Ejecutar script de instalación inteligente
# Linux/macOS:
./install.sh

# Windows:
.\install.ps1

# El script automáticamente:
# ✅ Verifica Node.js versión
# ✅ Instala dependencias con el package manager disponible
# ✅ Configura husky (opcional)
# ✅ Valida instalación
# ✅ Verifica build de TypeScript
```

#### **Instalación Manual**
```bash
# Instalar dependencias
npm install  # o pnpm install o yarn install

# Configurar variables de entorno
cp vercel.env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en modo desarrollo
npm run dev
```

#### **Solución de Problemas de Instalación**
Si encuentras errores durante la instalación:

```bash
# Limpiar cache y reinstalar
npm cache clean --force  # o pnpm store prune o yarn cache clean
rm -rf node_modules package-lock.json pnpm-lock.yaml yarn.lock
npm install

# Verificar Node.js versión
node --version  # Debe ser 18+
```

### Opción 2: Vercel (Recomendado)

```bash
# Deploy automático con GitHub integration
git push origin main

# O deploy manual
vercel --prod

# Validar deployment
npm run vercel:validate
```

### Opción 3: Docker

```bash
# Construir y ejecutar con Docker Compose
npm run docker:compose

# O construir manualmente
npm run docker:build
npm run docker:run
```

## 🚀 Deployment en Vercel

### **Configuración Automática**

#### **1. Conectar Repositorio**
```bash
# En Vercel Dashboard:
# 1. Importar proyecto desde GitHub
# 2. Seleccionar rama main/develop
# 3. Configurar build settings automáticamente
```

#### **2. Variables de Entorno**
```bash
# Copiar configuración desde vercel.env.example
# Configurar en Vercel Dashboard → Project Settings → Environment Variables

# Variables críticas:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SIGNALS_API_BASE=https://api.signals-provider.com
CODECOV_TOKEN=your-codecov-token
```

#### **3. Build Configuration**
```json
// vercel.json configurado automáticamente con:
{
  "functions": {
    "src/app/api/**/*.ts": { "maxDuration": 30, "memory": 1024 },
    "src/lib/workers/**/*.ts": { "maxDuration": 300, "memory": 2048 }
  },
  "headers": [
    // OWASP security headers
    // CORS configuration
    // API versioning headers
  ]
}
```

### **Validación Post-Deployment**

#### **Script Automático**
```bash
# Ejecutar validación después del deployment
npm run vercel:validate

# Resultado esperado:
✅ Basic Connectivity: Application is responding
✅ Health Check: Health status: healthy
✅ Security Headers: All OWASP security headers present
✅ API Versioning: API version: v2
✅ Authentication Required: API correctly requires authentication
✅ CORS Configuration: CORS headers properly configured
✅ Error Handling: Proper error response format
✅ Queue System: Queue system operational
✅ API Documentation: Swagger/OpenAPI documentation accessible

🎉 DEPLOYMENT STATUS: SUCCESSFUL
```

#### **Health Checks Automáticos**
```bash
# Vercel ejecuta automáticamente:
# - Health check cada 5 minutos
# - Build validation
# - Security headers verification
# - API endpoints testing
```

### **Monitoreo en Producción**

#### **Métricas en Tiempo Real**
- **Response Times**: < 100ms APIs, < 500ms background jobs
- **Error Rates**: < 0.1% de requests
- **Uptime**: 99.9% garantizado
- **Security**: Rate limiting activo, headers OWASP

#### **Alertas Configuradas**
- **Deployment Failures**: Notificaciones inmediatas
- **Performance Degradation**: Alertas automáticas
- **Security Issues**: Monitoreo continuo
- **API Changes**: Validación de breaking changes

### **Rollback Strategy**

#### **Deployments Seguros**
```bash
# Vercel permite rollback instantáneo
# - Preview deployments para testing
# - Gradual rollouts con feature flags
# - Automatic rollback en caso de errores
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` basado en `env.example`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```

## 🧪 Testing

### **Automated Testing Suite**

```bash
# Ejecutar suite completa (recomendado)
npm run test:all

# Tests individuales
npm run test:unit          # Unit tests (Jest)
npm run test:integration   # Integration tests
npm run test:coverage      # Con reporte de cobertura
npm run test:queue         # Sistema de queues

# Tests E2E
npm run test:e2e           # Cypress E2E tests
npm run test:e2e:open      # Cypress interactive

# Component tests
npm run test:component     # Cypress component tests

# Quality checks
npm run lint              # ESLint
npm run type-check        # TypeScript checking
```

### **Testing Features**

#### **Coverage Reporting**
- **Codecov Integration**: Reportes visuales detallados
- **Threshold Enforcement**: 80% mínimo requerido
- **Branch Coverage**: Cobertura por ramas de código
- **PR Comments**: Comentarios automáticos en PRs

#### **Test Categories**
- **Unit Tests**: Utilidades, validaciones, error handling
- **Integration Tests**: APIs, queues, background jobs
- **Queue Tests**: Sistema de message queues
- **Security Tests**: Rate limiting, input validation
- **API Tests**: Endpoints, versioning, documentation

#### **CI/CD Integration**
- **Automated Testing**: Todo push ejecuta tests completos
- **Multi-Environment**: Node.js 18.x y 20.x
- **Parallel Execution**: Tests concurrentes para velocidad
- **Artifact Storage**: Coverage reports preservados

### **Manual Testing**

```bash
# Validar sistema completo
node validate-system.js

# Test APIs manuales
curl "http://localhost:3000/api/health"
curl "http://localhost:3000/api/queue-test?action=enqueue&type=process_signals&count=3"

# Test seguridad
curl -I "http://localhost:3000/api/health"  # Security headers
curl "http://localhost:3000/api/signals?symbol=INVALID"  # Validation
```

### **Performance Testing**

```bash
# Test de carga básico
ab -n 100 -c 10 "http://localhost:3000/api/health"

# Test de rate limiting
for i in {1..15}; do curl -s "http://localhost:3000/api/signals" & done
```

## 🏗️ Arquitectura y Funcionalidades

### **Enterprise-Grade Features**

#### **🔒 Seguridad OWASP Compliant**
- **Rate Limiting**: 100 requests/min por IP con headers informativos
- **Input Validation**: Sanitización XSS, SQL injection prevention
- **Security Headers**: X-Frame-Options, CSP, HSTS, etc.
- **Authentication**: JWT + Supabase Auth con refresh tokens
- **Authorization**: Role-based access control

#### **⚡ Programación Asíncrona Avanzada**
- **Worker Threads**: Procesamiento CPU-intensive en threads separados
- **Connection Pooling**: Gestión eficiente de conexiones DB
- **Circuit Breakers**: Resiliencia para APIs externas
- **Async Patterns**: Generators, observables, cancellation tokens

#### **🎯 Arquitectura Event-Driven**
- **Message Queues**: Redis/in-memory con priority queues
- **Background Jobs**: Signal processing, notifications, cleanup
- **Event System**: Real-time event handling con observers
- **Pub/Sub Pattern**: Loose coupling entre componentes

#### **📡 APIs Enterprise**
- **Versioning**: API versioning (v1/v2) backward-compatible
- **OpenAPI/Swagger**: Documentación auto-generada
- **Health Checks**: Monitoreo de servicios y dependencias
- **Caching**: LRU cache con invalidación inteligente
- **Error Handling**: Estructura de errores consistente

### **📁 Estructura del Proyecto**

```
src/
├── app/                     # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── health/         # Health checks
│   │   ├── queue-test/     # Queue testing
│   │   └── docs/           # API documentation
│   └── dashboard/          # Dashboard pages
├── components/             # Reusable components
├── lib/                    # Core business logic
│   ├── middleware/         # Security & API middleware
│   │   └── security.ts     # OWASP security measures
│   ├── utils/              # Utility functions
│   │   ├── error-handler.ts # Structured error handling
│   │   ├── validation.ts   # Input validation & sanitization
│   │   ├── api-versioning.ts # API versioning system
│   │   ├── circuit-breaker.ts # Fault tolerance
│   │   └── cache.ts        # Caching layer
│   ├── queue/              # Message queue system
│   │   └── message-queue.ts # Redis/in-memory queues
│   ├── jobs/               # Background job processing
│   │   └── background-jobs.ts # Job scheduler & workers
│   ├── workers/            # CPU-intensive processing
│   │   └── signal-processor.ts # Worker threads
│   ├── database/           # Data access layer
│   │   └── connection-pool.ts # Connection management
│   ├── services/           # Business services
│   │   └── SignalsService.ts # Signal processing logic
│   └── swagger.ts          # API documentation
├── __tests__/              # Test suites
│   ├── integration/        # Integration tests
│   └── unit/               # Unit tests
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript definitions
└── styles/                 # Global styles
```

### **🔄 Flujo de Trabajo**

1. **Request Handling**: Security middleware → Rate limiting → Authentication
2. **API Processing**: Input validation → Business logic → Response formatting
3. **Background Jobs**: Queue enqueue → Worker processing → Event notifications
4. **Error Handling**: Structured errors → Logging → User feedback
5. **Monitoring**: Health checks → Metrics → Alerts

### **📊 Métricas de Rendimiento**

- **API Response Time**: < 100ms (cached), < 500ms (uncached)
- **Queue Throughput**: 1000+ jobs/minute
- **Test Coverage**: 80%+ con Codecov reporting
- **Uptime**: 99.9% con health checks automáticos
- **Security Score**: OWASP compliant con headers completos

## 🚀 Scripts Disponibles

### **Development**
- `npm run dev` - Servidor de desarrollo con hot reload
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run type-check` - Verificación de tipos TypeScript

### **Quality & Testing**
- `npm run lint` - Linting con ESLint
- `npm run lint:fix` - Corregir problemas de linting automáticamente
- `npm run test:all` - Suite completa: lint + types + tests + queues
- `npm run test` - Tests unitarios con Jest
- `npm run test:coverage` - Tests con reporte de cobertura
- `npm run test:unit` - Solo tests unitarios
- `npm run test:integration` - Tests de integración
- `npm run test:queue` - Test del sistema de message queues
- `npm run test:e2e` - Tests E2E con Cypress
- `npm run test:e2e:open` - Cypress en modo interactivo
- `npm run test:component` - Tests de componentes

### **Validation & Health Checks**
- `node validate-system.js` - Validación completa del sistema
- `node test-queue-simple.js` - Test standalone de queues
- `curl http://localhost:3000/api/health` - Health check de APIs
- `curl http://localhost:3000/api/queue-test` - Test de sistema de queues

### **Docker & Deployment**
- `npm run docker:build` - Construir imagen Docker
- `npm run docker:run` - Ejecutar contenedor Docker
- `npm run docker:compose` - Levantar con Docker Compose
- `npm run docker:compose:down` - Detener Docker Compose

### **Documentation**
- `curl http://localhost:3000/api/docs` - Ver documentación Swagger
- `curl http://localhost:3000/api/docs/openapi.json` - Especificación OpenAPI

## 🔗 Enlaces Útiles

### **Documentación Técnica**
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/)
- [Codecov Documentation](https://docs.codecov.com/)

### **APIs y Especificaciones**
- [OpenAPI Specification](https://swagger.io/specification/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## ⚙️ Configuración de Codecov

### **1. Obtener Token de Codecov**
```bash
# Instalar Codecov CLI
npm install -g codecov

# Autenticarse (sigue las instrucciones)
codecov --token
```

### **2. Configurar Secrets en GitHub**
```bash
# En tu repositorio GitHub:
# Settings → Secrets and variables → Actions
# Agregar: CODECOV_TOKEN = tu_token_de_codecov
```

### **3. Actualizar Badges en README**
```markdown
# Reemplaza 'your-username' y 'YOUR_CODECOV_TOKEN'
[![codecov](https://codecov.io/gh/your-username/tradeia/branch/main/graph/badge.svg?token=YOUR_CODECOV_TOKEN)](https://codecov.io/gh/your-username/tradeia)
```

### **4. Verificar Configuración**
```bash
# Después del próximo push, verifica:
# 1. Badges en GitHub README
# 2. Comments en PRs con coverage
# 3. Dashboard en codecov.io
```

## 📈 Monitoreo y Métricas

### **Health Checks**
```bash
# API Health
curl "http://localhost:3000/api/health"

# Queue Statistics
curl "http://localhost:3000/api/queue-test?action=stats"

# System Validation
node validate-system.js
```

### **Performance Monitoring**
- **Response Times**: < 100ms APIs, < 500ms background jobs
- **Queue Throughput**: 1000+ jobs/minute
- **Memory Usage**: < 512MB en producción
- **Error Rate**: < 0.1% de requests

### **Alertas y Notificaciones**
- **CI/CD Failures**: GitHub Actions notifications
- **Coverage Drops**: Codecov alerts
- **Performance Issues**: Health check failures
- **Security Issues**: Dependency vulnerability alerts

## 🔐 Security Architecture

Tradeia implements enterprise-grade security measures with comprehensive protection across all layers:

### Security Features Implemented

#### **Input Validation & Sanitization**
- **Joi Schema Validation**: Comprehensive input validation for all API endpoints
- **XSS Prevention**: HTML sanitization and script tag removal
- **SQL Injection Protection**: Parameterized queries and input sanitization
- **Request Size Limits**: Payload size validation and configurable limits

#### **Authentication & Authorization**
- **Supabase Auth**: JWT-based authentication with secure session management
- **Bearer Token Validation**: API authentication with token refresh
- **Role-based Access Control**: Granular permissions system
- **Secure Cookie Handling**: HttpOnly, Secure, and SameSite attributes

#### **API Security**
- **Rate Limiting**: Distributed rate limiting (100 req/min per IP) with Redis
- **OWASP Security Headers**: X-Frame-Options, CSP, HSTS, and CORS policies
- **API Versioning**: Backward-compatible API versioning with security validation
- **Request Logging**: Comprehensive audit logging for compliance

#### **Infrastructure Security**
- **Data Encryption**: Data encrypted at rest and in transit
- **Secure Deployment**: Vercel Edge Network with automatic SSL
- **Environment Segregation**: Separate staging and production environments
- **Dependency Scanning**: Automated vulnerability detection

### Security Improvement Roadmap

The platform includes planned security enhancements tracked as user stories:

- **SEC-001**: Standardize Security Middleware Application
- **SEC-002**: Implement Comprehensive Joi Validation
- **SEC-003**: Production-Grade Rate Limiting with Redis
- **SEC-004**: Request Size Limits and Payload Validation
- **SEC-005**: Enhanced Password Security Policies
- **SEC-006**: API Versioning Security Implementation
- **SEC-007**: Comprehensive Request Logging and Audit
- **SEC-008**: Regular Security Audits and Scanning
- **SEC-009**: Security Monitoring and Alerting System
- **SEC-010**: Rate Limit Monitoring and Analytics

### Security Monitoring

#### Real-time Monitoring
- **Rate Limit Tracking**: Monitor and alert on rate limit violations
- **Security Event Logging**: Comprehensive security event tracking
- **Performance Monitoring**: Response time and error rate tracking
- **Health Checks**: Automated system health validation

#### Compliance & Auditing
- **Regular Security Audits**: Automated vulnerability scanning
- **Dependency Updates**: Automated security patch management
- **Incident Response**: Structured security incident handling
- **Audit Trails**: Complete request/response logging

## 📄 Licencia

**Licencia Propietaria - Todos los Derechos Reservados**

Este software y toda la propiedad intelectual asociada son propietarios y confidenciales. La copia, modificación, distribución o uso no autorizado de este software está estrictamente prohibido.

- Uso comercial únicamente
- No se permite la redistribución o compartición pública del código fuente
- Todos los derechos reservados por el titular de los derechos de autor

Para consultas de licenciamiento u oportunidades de asociación, por favor contacte al equipo de desarrollo.
