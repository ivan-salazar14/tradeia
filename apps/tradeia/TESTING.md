# 🧪 Guía Completa de Testing - TradeIA

Esta guía explica cómo probar todas las mejoras implementadas en el sistema de TradeIA.

## 📋 Resumen de Mejoras Implementadas

### ✅ Seguridad OWASP
- Rate limiting (100 requests/min por IP)
- Input validation con Joi
- Security headers (XSS, CSRF, etc.)
- Sanitización de inputs

### ✅ Programación Asíncrona Avanzada
- Worker threads para cálculos CPU-intensive
- Connection pooling para base de datos
- Circuit breakers para APIs externas
- Async patterns optimizados

### ✅ Arquitectura Event-Driven
- Message queues (Redis/in-memory)
- Background job processing
- Event-driven notifications
- Real-time processing

### ✅ API Improvements
- API versioning (v1/v2)
- OpenAPI/Swagger documentation
- Health checks y monitoreo
- Error handling estructurado

## 🚀 Cómo Ejecutar los Tests

### 1. Test del Sistema de Queues (Funciona sin servidor)

```bash
cd apps/tradeia

# Test completo del sistema de message queues
node test-queue-simple.js

# Resultado esperado:
# ✅ Total jobs enqueued: 6
# ✅ Signal processing jobs: 3 completados
# ✅ Notification jobs: 2 completados
# ✅ Data cleanup jobs: 1 completado
# ✅ Zero failures: Sistema completamente funcional
```

### 2. Tests Unitarios (Jest)

```bash
# Ejecutar todos los tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests específicos
npm run test:unit        # Solo tests unitarios
npm run test:integration # Tests de integración
```

### 3. Tests de API (Requiere servidor Next.js)

```bash
# Iniciar servidor en background
npm run dev &

# Esperar a que inicie, luego probar APIs
sleep 5

# Test de health check
curl "http://localhost:3000/api/health"

# Test del sistema de queues
curl "http://localhost:3000/api/queue-test"

# Enqueue jobs de prueba
curl "http://localhost:3000/api/queue-test?action=enqueue&type=process_signals&count=3"

# Ver estadísticas
curl "http://localhost:3000/api/queue-test?action=stats"
```

### 4. Tests de Seguridad

```bash
# Test de rate limiting (ejecutar múltiples veces rápidamente)
for i in {1..15}; do
  curl -s "http://localhost:3000/api/signals" -H "Authorization: Bearer test" &
done

# Debería ver respuestas 429 (Rate limit exceeded)

# Test de validación de input
curl "http://localhost:3000/api/signals?symbol=INVALID"
# Debería ver error 400: "Invalid symbol format"

# Test de security headers
curl -I "http://localhost:3000/api/health"
# Debería ver headers de seguridad
```

### 5. Tests de Versionado de API

```bash
# API sin versión (usa v2 por defecto)
curl "http://localhost:3000/api/signals"

# API con versión específica
curl "http://localhost:3000/api/v1/signals"
curl "http://localhost:3000/api/v2/signals"

# API con header de versión
curl "http://localhost:3000/api/signals" -H "X-API-Version: v1"
```

### 6. Tests de Documentación

```bash
# Ver documentación Swagger
curl "http://localhost:3000/api/docs"

# Ver especificación OpenAPI
curl "http://localhost:3000/api/docs/openapi.json"
```

## 🔧 Configuración de CI/CD

### GitHub Actions

El pipeline de CI/CD está configurado en `.github/workflows/ci.yml` e incluye:

- **Testing múltiple**: Node.js 18.x y 20.x
- **Linting**: ESLint con reglas de TypeScript
- **Type checking**: Verificación de tipos
- **Unit tests**: Con coverage reporting
- **Integration tests**: Tests de integración
- **E2E tests**: Cypress para tests end-to-end
- **Security scanning**: Auditoría de dependencias
- **Build verification**: Verificación de build
- **Deploy automático**: Staging y producción

### Scripts de NPM

```json
{
  "test": "jest",
  "test:coverage": "jest --coverage --watchAll=false",
  "test:unit": "jest --testPathPattern=src/lib",
  "test:integration": "jest --testPathPattern=integration",
  "test:queue": "node test-queue-simple.js",
  "test:all": "npm run lint && npm run type-check && npm run test:coverage && npm run test:queue",
  "lint": "eslint .",
  "type-check": "tsc --noEmit"
}
```

## 📊 Métricas de Calidad

### Coverage Requirements
```json
{
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

### Linting Rules
- TypeScript strict mode
- ESLint con reglas de Next.js
- Prettier para formato consistente
- Import sorting automático

## 🐛 Debugging y Troubleshooting

### Problemas Comunes

#### 1. Tests de Jest fallan con tipos
```bash
# Verificar configuración de Jest
npx jest --showConfig

# Verificar tipos de TypeScript
npm run type-check
```

#### 2. Tests de integración fallan
```bash
# Verificar que el servidor esté corriendo
curl "http://localhost:3000/api/health"

# Verificar variables de entorno
cat .env.local
```

#### 3. Tests de queues no funcionan
```bash
# Ejecutar test standalone
node test-queue-simple.js

# Verificar logs de la aplicación
tail -f logs/application.log
```

### Logs y Debugging

```bash
# Ver logs de la aplicación
tail -f logs/app.log

# Ver logs de queues
tail -f logs/queue.log

# Debug mode
DEBUG=* npm run dev
```

## 📈 Monitorización

### Métricas en Tiempo Real

```bash
# Estadísticas de queues
curl "http://localhost:3000/api/queue-test?action=stats"

# Health check detallado
curl "http://localhost:3000/api/health"

# Métricas de sistema
curl "http://localhost:3000/api/health" -X POST
```

### Dashboards Recomendados

1. **Queue Metrics**: Monitoreo de throughput y latency
2. **Error Rates**: Tasa de errores por endpoint
3. **Performance**: Response times y resource usage
4. **Security**: Failed auth attempts y rate limiting

## 🎯 Próximos Pasos

1. **Configurar Redis** para queues en producción
2. **Implementar monitoring** con DataDog/New Relic
3. **Agregar tests de carga** con Artillery
4. **Configurar alerting** para métricas críticas
5. **Implementar feature flags** para deployments graduales

## 📞 Soporte

Para problemas con los tests:

1. Verificar esta guía completa
2. Revisar logs de la aplicación
3. Ejecutar tests individuales
4. Verificar configuración de entorno
5. Consultar issues en el repositorio

---

## ✅ Checklist de Testing Completado

- [x] **Sistema de Queues**: Funciona correctamente
- [x] **Background Jobs**: Procesamiento asíncrono operativo
- [x] **API Security**: Rate limiting y validación funcionando
- [x] **Error Handling**: Manejo estructurado de errores
- [x] **API Versioning**: Versionado backward-compatible
- [x] **Documentation**: OpenAPI/Swagger generado
- [x] **Health Checks**: Monitoreo de servicios activo
- [x] **CI/CD Pipeline**: GitHub Actions configurado
- [x] **Code Quality**: Linting y type checking activo
- [x] **Test Coverage**: Umbrales de cobertura definidos

¡El sistema de TradeIA está completamente probado y listo para producción! 🚀