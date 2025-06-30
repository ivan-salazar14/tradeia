---
description: Reglas para Supabase 2.60.0 como base de datos y autenticación
globs: **/*.ts,**/*.tsx
alwaysApply: false
---

# Supabase Database

## Configuración
- Usar el cliente de Supabase desde src/lib/supabase.ts
- Configurar variables de entorno para credenciales de Supabase
- Implementar manejo de errores robusto para operaciones de base de datos
- Usar tipos TypeScript generados para las tablas de Supabase

## Autenticación
- Usar Supabase Auth para manejo de usuarios
- Implementar autenticación con email y magic links
- Usar el hook useAuth de Supabase para estado de autenticación
- Proteger rutas y componentes basados en estado de autenticación
- Manejar sesiones de usuario de forma segura

## Realtime
- Usar Supabase Realtime para actualizaciones en tiempo real
- Implementar suscripciones a cambios de base de datos cuando sea necesario
- Manejar conexiones WebSocket de forma eficiente
- Limpiar suscripciones cuando los componentes se desmonten
- Usar canales específicos para diferentes tipos de datos

## Seguridad
- Implementar Row Level Security (RLS) en todas las tablas
- Validar datos en el cliente y servidor
- Usar prepared statements para prevenir SQL injection
- Implementar rate limiting para operaciones críticas
- Mantener logs de auditoría para operaciones sensibles 