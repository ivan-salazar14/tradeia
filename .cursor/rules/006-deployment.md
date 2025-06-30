---
description: Reglas para deployment con Vercel y Docker
globs: docker-compose.yml,Dockerfile,next.config.ts
alwaysApply: false
---

# Deployment

## Vercel
- Usar Vercel como plataforma de deployment principal
- Configurar variables de entorno en Vercel dashboard
- Aprovechar las optimizaciones automáticas de Vercel para Next.js
- Implementar preview deployments para pull requests
- Usar edge functions cuando sea apropiado

## Docker
- Mantener Dockerfile optimizado para producción
- Usar multi-stage builds para reducir tamaño de imagen
- Configurar docker-compose.yml para desarrollo local
- Implementar health checks en contenedores
- Optimizar cache de dependencias en builds

## Configuración de Entorno
- Usar env.example para documentar variables requeridas
- Separar configuraciones de desarrollo y producción
- Implementar validación de variables de entorno
- Usar secretos de Vercel para información sensible
- Mantener configuración consistente entre entornos

## CI/CD y Monitoreo
- Implementar tests automáticos en pipeline de deployment
- Configurar alertas para errores de producción
- Implementar rollback automático en caso de fallos
- Monitorear métricas de rendimiento y errores
- Mantener logs estructurados para debugging 