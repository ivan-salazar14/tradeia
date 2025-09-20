# Tradeia

Tradeia is a comprehensive trading platform consisting of two main applications: a landing page for marketing and user acquisition, and a full-featured trading dashboard for portfolio management, backtesting, and strategy analysis.

## 📱 Applications

### 🏠 Landing Page (`apps/landing`)
A modern, responsive marketing website built with React, TypeScript, and Tailwind CSS. This serves as the entry point for users, providing information about the platform, features, pricing, and documentation.

**Tech Stack:**
- **Framework**: Vite + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons, Lucide React
- **Routing**: React Router DOM

**Features:**
- Responsive design optimized for all devices
- Multi-language support
- SEO optimized
- Fast loading with Vite build system

### 📊 Trading Dashboard (`apps/tradeia`)
A powerful web application for algorithmic trading, built with Next.js 15 and modern web technologies. Provides comprehensive tools for strategy development, backtesting, portfolio management, and real-time trading signals.

**Tech Stack:**
- **Framework**: Next.js 15.3.4
- **Language**: TypeScript 5.4.3
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Headless UI 2.2.4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Notifications**: Firebase Cloud Messaging
- **Charts**: Chart.js 4.4.2
- **Testing**: Jest, React Testing Library, Cypress
- **Deployment**: Vercel

**Features:**
- User authentication and authorization
- Strategy creation and management
- Backtesting engine with historical data
- Portfolio tracking and analytics
- Real-time trading signals
- API key management for external integrations
- Dashboard with comprehensive stats and charts
- Mobile-responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tradeia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `apps/tradeia/env.example` to `apps/tradeia/.env.local`
   - Configure your Supabase and Firebase credentials

4. **Run the applications**
   ```bash
   # Landing page (port 5173)
   cd apps/landing
   npm run dev

   # Trading dashboard (port 3000) - in another terminal
   cd apps/tradeia
   npm run dev
   ```

### Docker Setup

The trading dashboard supports Docker deployment:

```bash
cd apps/tradeia
npm run docker:compose  # Builds and runs with Docker Compose
```

## 📁 Project Structure

```
tradeia/
├── apps/
│   ├── landing/          # Marketing website (Vite + React)
│   │   ├── src/
│   │   ├── public/
│   │   └── docs/         # Strategy documentation
│   └── tradeia/          # Main trading platform (Next.js)
│       ├── src/
│       ├── supabase/     # Database migrations
│       └── cypress/      # E2E tests
├── package.json          # Root build scripts
└── vercel.json           # Deployment configuration
```

## 🔧 Development

### Available Scripts

**Root level:**
- `npm run build` - Build both applications
- `npm run build:next` - Build trading dashboard
- `npm run build:vite` - Build landing page

**Landing page (`apps/landing`):**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Trading dashboard (`apps/tradeia`):**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run docker:compose` - Run with Docker

## 🚀 Deployment

The project is configured for deployment on Vercel with the following routing:

- `/` - Landing page
- `/app/*` - Trading dashboard
- `/landing/*` - Landing page (alternative route)

## 📚 Documentation

- [Trading Strategies](./apps/landing/docs/) - Strategy documentation and guides
- [API Reference](./apps/tradeia/docs/) - API documentation and integrations
- [Development Guide](./apps/tradeia/README.md) - Detailed setup for the trading platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

**Proprietary License - All Rights Reserved**

This software and all associated intellectual property are proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

- Commercial use only
- No redistribution or public sharing of source code
- All rights reserved by the copyright holder

For licensing inquiries or partnership opportunities, please contact the development team.