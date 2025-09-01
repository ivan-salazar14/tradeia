---
description: Reglas para Chart.js 4.4.2 y visualizaciones de datos
globs: **/*.tsx,**/*.ts
alwaysApply: false
---

# Chart.js Visualizaciones

## Configuración
- Usar Chart.js 4.4.2 para todas las visualizaciones de datos
- Configurar charts desde src/lib/chart-config.ts
- Implementar temas consistentes para todos los gráficos
- Usar tipos TypeScript para configuración de charts

## Implementación
- Crear componentes de chart reutilizables
- Usar React hooks para manejar el ciclo de vida de charts
- Implementar responsive charts que se adapten a diferentes tamaños
- Manejar datos dinámicos y actualizaciones en tiempo real
- Limpiar instancias de chart cuando los componentes se desmonten

## Optimización
- Usar lazy loading para charts complejos
- Implementar debouncing para actualizaciones frecuentes
- Optimizar el rendimiento con canvas rendering
- Usar plugins específicos solo cuando sea necesario
- Mantener charts accesibles con ARIA labels

## Accesibilidad
- Proporcionar descripciones alternativas para charts
- Implementar navegación por teclado para gráficos interactivos
- Usar colores con suficiente contraste
- Proporcionar datos tabulares como alternativa
- Implementar zoom y pan para gráficos complejos 