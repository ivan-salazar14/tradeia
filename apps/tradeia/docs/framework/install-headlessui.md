# Instalación de Headless UI v2.2.4

Headless UI es una biblioteca de componentes UI sin estilos y totalmente accesibles, diseñada para integrarse perfectamente con Tailwind CSS.

## Requisitos Previos
- Node.js
- npm o yarn
- Un proyecto React

## Instalación

Para instalar Headless UI v2.2.4 en tu proyecto, ejecuta uno de los siguientes comandos:

```bash
# Usando npm
npm install @headlessui/react@2.2.4

# Usando yarn
yarn add @headlessui/react@2.2.4
```

## Uso Básico

```jsx
import { Menu } from '@headlessui/react'

function MyDropdown() {
  return (
    <Menu>
      <Menu.Button>Opciones</Menu.Button>
      <Menu.Items>
        <Menu.Item>
          {({ active }) => (
            <a
              className={`${active && 'bg-blue-500'}`}
              href="/cuenta"
            >
              Mi Cuenta
            </a>
          )}
        </Menu.Item>
        {/* Más items... */}
      </Menu.Items>
    </Menu>
  )
}
```

## Integración con Tailwind CSS

Headless UI está diseñado para trabajar perfectamente con Tailwind CSS. No incluye estilos por defecto, lo que te permite personalizar completamente la apariencia de tus componentes usando las clases de utilidad de Tailwind.

## Documentación Adicional

Para más información y ejemplos detallados, visita:
- [Documentación oficial de Headless UI](https://headlessui.com/)
- [GitHub Repository](https://github.com/tailwindlabs/headlessui) 