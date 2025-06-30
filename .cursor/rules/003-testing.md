---
description: Reglas para testing con Jest, React Testing Library y Cypress
globs: **/*.test.{ts,tsx,js,jsx},**/*.spec.{ts,tsx,js,jsx},cypress/**/*
alwaysApply: false
---

# Testing

## Jest Unit Testing
- Usar Jest 30.0.0 para pruebas unitarias
- Escribir pruebas para todas las funciones y utilidades
- Usar describe blocks para agrupar pruebas relacionadas
- Implementar mocks para dependencias externas
- Mantener cobertura de código alta

## React Testing Library
- Usar React Testing Library 16.0.0 para pruebas de componentes
- Escribir pruebas desde la perspectiva del usuario
- Usar queries accesibles como getByRole, getByLabelText
- Evitar usar getByTestId a menos que sea absolutamente necesario
- Probar comportamientos en lugar de implementaciones

## Cypress E2E
- Usar Cypress 13.6.0 para pruebas end-to-end
- Escribir pruebas que cubran flujos completos de usuario
- Usar fixtures para datos de prueba
- Implementar custom commands para acciones repetitivas
- Mantener pruebas independientes y aisladas

## Testing Best Practices
- Seguir el patrón AAA (Arrange, Act, Assert)
- Usar nombres descriptivos para pruebas
- Mantener pruebas rápidas y confiables
- Implementar pruebas de integración para APIs
- Usar TypeScript en archivos de prueba

## Gestión de Datos de Prueba
- Usar factories para crear datos de prueba consistentes
- Implementar cleanup automático después de cada prueba
- Usar mocks para servicios externos
- Mantener datos de prueba independientes entre tests
- Documentar casos edge en pruebas 