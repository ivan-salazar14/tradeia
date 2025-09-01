---
description: Reglas para componentes React con Headless UI 2.2.4 y Tailwind CSS 3.4.1
globs: **/*.tsx,**/*.jsx
alwaysApply: false
---

# Componentes React

## Headless UI
- Usar Headless UI para componentes de interfaz complejos
- Implementar componentes accesibles con ARIA attributes automáticos
- Preferir Headless UI sobre componentes personalizados para funcionalidad compleja
- Usar la API de composición de Headless UI para máxima flexibilidad
- Mantener la separación entre lógica y presentación

## Tailwind CSS
- Usar clases de utilidad de Tailwind CSS para estilos
- Aprovechar el sistema de diseño de Tailwind para consistencia
- Usar variantes responsive y de estado cuando sea apropiado
- Preferir clases de Tailwind sobre CSS personalizado
- Usar tailwind-merge para combinar clases dinámicamente

## Estructura de Componentes
- Crear componentes funcionales con hooks de React
- Usar destructuring para props de componentes
- Implementar PropTypes o TypeScript interfaces para validación
- Mantener componentes pequeños y enfocados en una responsabilidad
- Usar React.memo para optimización cuando sea necesario

## Accesibilidad
- Implementar navegación por teclado en todos los componentes interactivos
- Usar roles ARIA apropiados para componentes complejos
- Mantener contraste de colores según estándares WCAG
- Probar componentes con lectores de pantalla
- Implementar focus management apropiado 