# Flujo Integrado de Estrategias por Usuario

## Descripción General

Este documento describe el flujo integrado para manejar estrategias activas por usuario, desde la autenticación hasta la generación de señales, implementado a través de las historias de usuario US-040, US-041 y US-042.

## Flujo de Trabajo

### 1. Autenticación y Token JWT (US-040)

**Entrada:** Usuario se autentica
**Proceso:** 
- Sistema valida credenciales
- Genera token JWT con estrategias activas del usuario
- Incluye campo `active_strategies` en el payload

**Estructura del Token:**
```json
{
  "sub": "user_123",
  "email": "user@example.com",
  "active_strategies": ["moderate", "conservative"],
  "subscription_plan": "premium",
  "exp": 1234567890
}
```

### 2. Gestión de Usuario en Base de Datos (US-041)

**Entrada:** Token JWT válido
**Proceso:**
- Middleware extrae datos del usuario del token
- Verifica si el usuario existe en la base de datos
- Si no existe: crea nuevo registro
- Si existe: actualiza información (último login, estrategias activas)

**Estructura de Usuario en BD:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscription_plan VARCHAR(50),
    active_strategies TEXT[],
    last_login TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Generación de Señales con Estrategia (US-042)

**Entrada:** Solicitud de generación de señales
**Proceso:**
1. Extrae estrategias activas del token JWT
2. Valida que el usuario tenga estrategias activas
3. Genera señales para cada estrategia activa
4. Asigna `strategy_id` a cada señal
5. Guarda señales en base de datos

**Validaciones:**
- Usuario tiene al menos una estrategia activa
- Estrategias son válidas y están permitidas
- Señal incluye `strategy_id` antes de guardar

## Integración con US-038 y US-043

Las nuevas historias se integran con la US-038 (Relación señal-estrategia) y US-043 (Cronjob automático) para completar el flujo:

1. **US-040:** Proporciona las estrategias activas del usuario
2. **US-041:** Mantiene el usuario actualizado en BD
3. **US-042:** Asigna estrategia a cada señal generada
4. **US-038:** Almacena la relación señal-estrategia en BD
5. **US-043:** Genera señales automáticamente con cronjob

### Flujo Completo Integrado:
```
CRONJOB (US-043) → TOKEN JWT (US-040) → BD USUARIO (US-041) → GENERACIÓN SEÑALES (US-042) → ALMACENAMIENTO (US-038) → CONSULTA API
```

## Beneficios del Flujo Integrado

### Para el Usuario:
- Solo recibe señales de estrategias que tiene activas
- Transparencia en qué estrategia generó cada señal
- Control sobre su plan de suscripción

### Para el Sistema:
- Trazabilidad completa de señales por estrategia
- Validación automática de permisos
- Auditoría de uso de estrategias
- Análisis de rendimiento por estrategia

### Para el Negocio:
- Control de acceso por plan de suscripción
- Métricas de uso por estrategia
- Facturación basada en estrategias activas

## Endpoints Afectados

### Generación de Señales
```bash
POST /signals/generate?symbol=BTC/USDT&timeframe=4h
```
- Ahora filtra por estrategias activas del usuario
- Asigna `strategy_id` a cada señal
- Valida permisos antes de generar

### Consulta de Señales
```bash
GET /signals?strategy_id=moderate&limit=50
```
- Permite filtrar por estrategia específica
- Respeta estrategias activas del usuario

### Gestión de Usuario
```bash
GET /user/profile
```
- Retorna información del usuario incluyendo estrategias activas
- Muestra plan de suscripción actual

### Sistema de Cronjob (US-043)
```bash
# Estado del cronjob
GET /cronjob/status

# Historial de ejecuciones
GET /cronjob/logs?job_name=4h_signals&limit=10

# Forzar ejecución manual
POST /cronjob/run?job_name=4h_signals

# Consultar señales automáticas
GET /signals/auto?timeframe=4h&symbol=BTC/USDT
```

## Consideraciones de Seguridad

1. **Validación de Token:** Verificar que las estrategias en el token sean válidas
2. **Autorización:** Solo permitir acceso a estrategias activas
3. **Auditoría:** Registrar cambios en estrategias activas
4. **Rate Limiting:** Limitar generación de señales por estrategia
5. **Refresh Token:** Actualizar estrategias activas cuando cambie el plan

## Próximos Pasos

1. Implementar US-040: Estrategias en token JWT
2. Implementar US-041: Gestión de usuarios en BD
3. Implementar US-042: Asignación de estrategia a señales
4. Implementar US-043: Sistema de cronjob automático
5. Integrar con sistema de suscripciones
6. Implementar métricas y análisis por estrategia

## Documentación Relacionada

- [US-038: Relación señal-estrategia](../../.planr/stories/US-038.md)
- [US-039: Relación usuario-estrategia](../../.planr/stories/US-039.md)
- [US-040: Estrategias en token JWT](../../.planr/stories/US-040.md)
- [US-041: Gestión de usuarios](../../.planr/stories/US-041.md)
- [US-042: Asignación de estrategia](../../.planr/stories/US-042.md)
- [US-043: Generación automática con cronjob](../../.planr/stories/US-043.md)
- [SISTEMA_CRONJOB_SEÑALES.md](./SISTEMA_CRONJOB_SEÑALES.md) 