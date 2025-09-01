# Tradeia

Una aplicación web moderna construida con Next.js 15, TypeScript, Tailwind CSS y un stack tecnológico completo para trading y análisis financiero.

## 🚀 Tech Stack

- **Framework**: Next.js 15.3.4
- **Lenguaje**: TypeScript 5.4.3
- **Estilos**: Tailwind CSS 3.4.1
- **UI Components**: Headless UI 2.2.4
- **Base de Datos**: Supabase 2.60.0 (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Tiempo Real**: Supabase Realtime
- **Notificaciones**: Firebase Cloud Messaging 10.12.0
- **Gráficos**: Chart.js 4.4.2
- **Fechas**: date-fns 3.6.0
- **Testing**: Jest 30.0.0, React Testing Library 16.0.0, Cypress 13.6.0
- **Deployment**: Vercel

## 📦 Instalación

### Opción 1: Desarrollo Local

```bash
# Clonar el repositorio
git clone <repository-url>
cd tradeia

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en modo desarrollo
npm run dev
```

### Opción 2: Docker

```bash
# Construir y ejecutar con Docker Compose
npm run docker:compose

# O construir manualmente
npm run docker:build
npm run docker:run
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

```bash
# Unit tests con Jest
npm test
npm run test:watch
npm run test:coverage

# E2E tests con Cypress
npm run test:e2e
npm run test:e2e:open

# Component tests
npm run test:component
```

## 📁 Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
├── components/          # Componentes reutilizables
├── lib/                 # Utilidades y configuraciones
│   ├── supabase.ts     # Configuración de Supabase
│   ├── firebase.ts     # Configuración de Firebase
│   ├── chart-config.ts # Configuración de Chart.js
│   └── utils.ts        # Utilidades generales
├── hooks/              # Custom hooks
├── types/              # Tipos de TypeScript
└── styles/             # Estilos globales
```

## 🚀 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting con ESLint
- `npm test` - Ejecutar tests unitarios
- `npm run test:e2e` - Ejecutar tests E2E
- `npm run docker:compose` - Levantar con Docker Compose

## 🔗 Enlaces Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)

## 📄 Licencia

MIT
