---
description: Reglas para Firebase Cloud Messaging 10.12.0 y notificaciones push
globs: **/*.ts,**/*.tsx
alwaysApply: false
---

# Firebase Cloud Messaging

## Configuración
- Usar Firebase Cloud Messaging 10.12.0 para notificaciones push
- Configurar Firebase desde src/lib/firebase.ts
- Solicitar permisos de notificación de forma apropiada
- Manejar tokens de dispositivo de forma segura

## Implementación
- Implementar service worker para notificaciones en segundo plano
- Manejar diferentes tipos de notificaciones push
- Usar date-fns 3.6.0 para formateo de fechas en notificaciones
- Implementar notificaciones en tiempo real para actualizaciones críticas
- Manejar clics en notificaciones y navegación apropiada

## Gestión de Estado
- Mantener estado de suscripción a notificaciones
- Implementar preferencias de usuario para tipos de notificación
- Manejar errores de entrega de notificaciones
- Limpiar tokens obsoletos automáticamente
- Sincronizar estado de notificaciones con Supabase

## UX y Rendimiento
- Mostrar indicadores de carga durante el envío de notificaciones
- Implementar notificaciones silenciosas para actualizaciones no críticas
- Usar iconos y colores apropiados para diferentes tipos de notificación
- Implementar rate limiting para evitar spam de notificaciones
- Proporcionar opciones de configuración granular para usuarios 