import { Language } from '../contexts/LanguageContext';

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      features: 'Features',
      strategies: 'Strategies',
      pricing: 'Pricing',
      education: 'Education',
      docs: 'Documentation',
      about: 'About',
      contact: 'Contact'
    },

    // Hero Section
    hero: {
      title: 'Welcome to TradeIA',
      subtitle: 'Make your decisions based on precise technical analysis',
      description: 'a platform specializing in strategies for trading cryptocurrencies. Using advanced technical analysis, we generate precise buy/sell signals based on real-time market data. Our system is built for reliability, with optimized cronjobs, a secure API, and customizable strategies.',
      benefits: {
        signals: {
          title: 'Automated Signals',
          description: 'Get entry/exit points with stop-loss and take-profit levels'
        },
        precision: {
          title: 'High Precision',
          description: 'Backed by indicators like EMA55, RSI, ADX, and SQZMOM'
        },
        security: {
          title: 'Secure & Efficient',
          description: 'database, JWT authentication, and low-latency processing'
        }
      },
      buttons: {
        signup: 'Sign Up',
        login: 'Login',
        demo: 'Demo Dashboard'
      }
    },

    // Features Section
    features: {
      title: 'Our Features',
      description: 'TradeIA offers a suite of tools to make trading seamless. We\'ve enhanced user facilities with intuitive dashboards, real-time alerts, and integrations for better usability.',
      items: {
        dashboard: {
          title: 'User Dashboard',
          description: 'Personalized overview tracking active signals, portfolio performance, and historical trades. Filter by symbol, timeframe, and strategy with customizable preferences.'
        },
        api: {
          title: 'API Integration',
          description: 'RESTful endpoints for manual signal generation, data fetching, and health checks. Secure JWT authentication with webhook support for real-time signal delivery.'
        },
        notifications: {
          title: 'Notifications & Alerts',
          description: 'Real-time updates via email, SMS, or app push notifications. Cronjob-driven scans every 15-30 minutes with customizable filters for different strategies.'
        },
        backtesting: {
          title: 'Backtesting & Simulation',
          description: 'Test strategies against historical data with comprehensive metrics and paper trading mode.'
        },
        risk: {
          title: 'Risk Management',
          description: 'Dynamic stop-loss and intelligent position sizing to protect your capital. All strategies enforce 1:1+ risk/reward ratios with 12-hour signal cooldowns.'
        },
        signals: {
          title: 'High-Precision Signals',
          description: 'Advanced technical analysis using EMA55, RSI, ADX, and SQZMOM indicators. Optimized cronjobs ensure low-latency processing with PostgreSQL database.'
        }
      },
      cta: {
        api: 'Explore API Docs',
        notifications: 'Set Up Notifications'
      }
    },

    // Strategies Section
    strategies: {
      title: 'Trading Strategies: Customizable & Proven',
      description: 'Our strategies follow the Strategy Pattern for flexibility. We\'ve expanded this section with examples, pros/cons, and customization tips to help users choose wisely.',
      conservative: {
        title: 'Conservative',
        description: 'Criteria: Strict conditions (ADX > 25, RSI < 30, SQZMOM > 0, DMI difference > 5, ATR > 75). Frequency: Low. Best For: Risk-averse traders focusing on major pairs like BTC/USDT.',
        winRate: '80%',
        riskReward: '1:1+'
      },
      moderate: {
        title: 'Moderate',
        description: 'Criteria: 4/5 conditions (RSI <40/>60, ADX >15, SQZMOM ≠0, DMI diff >3, ATR >50). Frequency: Balanced. Best For: Everyday traders on mid-priority pairs like XRP/USDT.',
        winRate: 'Good',
        riskReward: '1:1 min'
      },
      aggressive: {
        title: 'Aggressive',
        description: 'Criteria: Relaxed (ADX >10, minimal DMI/ATR filters). Frequency: High. Best For: High-volume traders on altcoins like SOL/USDT.',
        winRate: 'More Trades',
        riskReward: 'Higher Risk'
      },
      specialized: {
        title: 'SQZMOM + ADX Specialized',
        description: 'Criteria: Focus on squeeze momentum with ADX for breakout detection. Best For: Volatility plays in low-priority pairs like ADA/USDT.',
        winRate: 'Excellent',
        riskReward: '3x ATR'
      },
      buttons: {
        select: 'Select a Strategy',
        backtest: 'Backtest Now'
      }
    },

    // Education Section
    education: {
      title: 'Education Center: Learn to Trade Like a Pro',
      description: 'To empower users, we\'ve added a dedicated education hub. This addresses the lack of learning resources, focusing on indicators, strategies, and best practices.',
      indicators: {
        ema55: {
          title: 'EMA55',
          description: 'Learn how this 55-period exponential moving average identifies trends.',
          video: 'Spotting Bullish Crossovers'
        },
        rsi: {
          title: 'RSI (14)',
          description: 'Detect overbought/oversold levels with the Relative Strength Index.',
          video: 'Interactive Calculator Tool'
        },
        adx: {
          title: 'ADX & DMI',
          description: 'Measure trend strength and direction with Average Directional Index.',
          video: 'Real Crypto Examples Quiz'
        },
        sqzmom: {
          title: 'SQZMOM',
          description: 'Spot momentum squeezes for breakout opportunities.',
          video: 'BTC Squeeze Case Study'
        },
        atr: {
          title: 'ATR',
          description: 'Understand volatility for optimal stop-loss placement.',
          video: 'ATR Calculation Worksheet'
        }
      },
      resources: {
        basics: {
          title: 'Trading Basics',
          items: [
            '"Crypto Trading 101" – From wallets to exchanges',
            'Advanced Topics: Risk management, backtesting pitfalls',
            'Strategy Education: Building Your First Moderate Strategy'
          ]
        },
        community: {
          title: 'Resources',
          items: [
            'Glossary: 50+ terms explained (OHLCV, Cronjob)',
            'Blog & Videos: Weekly posts on 2025 trends',
            'Community Forum: Discuss strategies with other users'
          ]
        }
      },
      certification: {
        title: 'Free Certification Course',
        description: '"Quantitative Crypto Trading" – Self-paced course with quizzes and badges. Learn to avoid common pitfalls like overtrading.',
        features: ['Certificate upon completion', 'Community moderated Q&A', 'Weekly live webinars'],
        cta: 'Start Learning'
      }
    },

    // Services Section
    services: {
      title: 'Why Choose TradeIA?',
      description: 'Join thousands of traders who trust TradeIA for automated, data-driven cryptocurrency trading signals',
      items: {
        marketData: {
          title: 'Real-Time Market Data',
          description: 'Direct integration with Binance API for live cryptocurrency market data and instant signal generation.'
        },
        signals: {
          title: 'Automated Signal Generation',
          description: 'AI-powered algorithms analyze multiple indicators to generate precise buy/sell signals with entry/exit points.'
        },
        risk: {
          title: 'Risk Management',
          description: 'Built-in stop-loss and take-profit levels with dynamic position sizing based on your risk tolerance.'
        },
        backtesting: {
          title: 'Backtesting & Simulation',
          description: 'Test strategies against historical data with comprehensive metrics and paper trading mode.'
        },
        mobile: {
          title: 'Mobile & Web Access',
          description: 'Monitor your portfolio and signals anywhere with our responsive dashboard and mobile notifications.'
        },
        api: {
          title: 'API Integration',
          description: 'RESTful API with webhooks for seamless integration with your trading bots and applications.'
        }
      },
      cta: {
        title: 'Ready to Start Trading Smarter?',
        description: 'Join TradeIA today and transform your cryptocurrency trading with AI-powered signals, comprehensive education, and professional-grade tools.',
        trial: 'Start Free Trial',
        demo: 'View Demo'
      }
    },

    // Getting Started Section
    gettingStarted: {
      title: 'Start Trading in 3 Simple Steps',
      description: 'Get up and running with TradeIA\'s automated trading signals in just a few minutes.',
      steps: {
        account: {
          title: 'Create Your Account',
          description: 'Sign up for free and verify your email to access the platform.',
          action: 'Register Now'
        },
        strategy: {
          title: 'Choose Your Strategy',
          description: 'Select from Conservative, Moderate, or Aggressive strategies based on your risk tolerance.',
          action: 'View Strategies'
        },
        signals: {
          title: 'Start Receiving Signals',
          description: 'Connect your exchange API and begin receiving automated trading signals.',
          action: 'Connect Exchange'
        }
      },
      resources: {
        title: 'Ready to Trade?',
        description: 'Start receiving automated trading signals with our comprehensive platform.',
        trial: 'Start Free Trial',
        docs: 'API Documentation',
        education: 'Education Center'
      },
      bottom: {
        title: 'Join Thousands of Successful Traders',
        description: 'TradeIA is trusted by crypto traders worldwide for reliable automated signals and comprehensive trading tools.',
        signup: 'Start Trading Now',
        dashboard: 'Login to Dashboard →'
      }
    }
  },

  es: {
    // Navigation
    nav: {
      home: 'Inicio',
      features: 'Características',
      strategies: 'Estrategias',
      pricing: 'Precios',
      education: 'Educación',
      docs: 'Documentación',
      about: 'Acerca de',
      contact: 'Contacto'
    },

    // Hero Section
    hero: {
      title: 'Bienvenido a TradeIA',
      subtitle: 'Has tus decisiones basadas en análisis técnico preciso',
      description: 'Una plataforma especializada en estrategias de trading para criptomonedas. Utilizando análisis técnico avanzado, generamos señales precisas de compra/venta basadas en datos de mercado en tiempo real. Con backtesting y cronjobs optimizados, una API segura y estrategias personalizables.',
      benefits: {
        signals: {
          title: 'Estrategias Pre-Configuradas',
          description: 'Obtén puntos de entrada/salida con stop-loss y take-profit'
        },
        precision: {
          title: 'Alta Precisión',
          description: 'Respaldado por indicadores como EMA55, RSI, ADX y SQZMOM'
        },
        security: {
          title: 'Seguro y Eficiente',
          description: ' autenticación segura y procesamiento de baja latencia'
        }
      },
      buttons: {
        signup: 'Regístrate es Gratis',
        login: 'Iniciar Sesión',
        demo: 'Demo del Dashboard'
      }
    },

    // Features Section
    features: {
      title: 'Nuestras Características Principales (Instalaciones)',
      description: 'TradeIA ofrece una suite de herramientas para hacer el trading seamless. Hemos mejorado las instalaciones de usuario con dashboards intuitivos, alertas en tiempo real e integraciones para mejor usabilidad.',
      items: {
        dashboard: {
          title: 'Dashboard de Usuario',
          description: 'Resumen personalizado rastreando señales activas, rendimiento del portafolio y trades históricos. Filtra por símbolo, timeframe y estrategia con preferencias personalizables.'
        },
        api: {
          title: 'Integración API',
          description: 'Endpoints RESTful para generación manual de señales, obtención de datos y verificación de salud. Autenticación JWT segura con soporte de webhooks para entrega de señales en tiempo real.'
        },
        notifications: {
          title: 'Notificaciones y Alertas',
          description: 'Actualizaciones en tiempo real vía email, SMS o notificaciones push de app. Escaneos impulsados por cronjob cada 15-30 minutos con filtros personalizables para diferentes estrategias.'
        },
        backtesting: {
          title: 'Backtesting y Simulación',
          description: 'Prueba estrategias contra datos históricos con métricas comprehensivas y modo de paper trading.'
        },
        risk: {
          title: 'Gestión de Riesgo',
          description: 'Stop-loss dinámico y dimensionamiento inteligente de posiciones para proteger tu capital. Todas las estrategias aplican ratios de riesgo/recompensa de 1:1+ con cooldown de señales de 12 horas.'
        },
        signals: {
          title: 'Señales de Alta Precisión',
          description: 'Análisis técnico avanzado usando indicadores EMA55, RSI, ADX y SQZMOM. Cronjobs optimizados aseguran procesamiento de baja latencia con base de datos PostgreSQL.'
        }
      },
      cta: {
        api: 'Explorar Documentos API',
        notifications: 'Configurar Notificaciones'
      }
    },

    // Strategies Section
    strategies: {
      title: 'Estrategias de Trading: Personalizables y Probadas',
      description: 'Nuestras estrategias siguen el Patrón de Estrategia para flexibilidad. Hemos expandido esta sección con ejemplos, pros/cons y consejos de personalización para ayudar a los usuarios a elegir sabiamente.',
      conservative: {
        title: 'Conservadora',
        description: 'Criterios: Condiciones estrictas (ADX > 25, RSI < 30, SQZMOM > 0, diferencia DMI > 5, ATR > 75). Frecuencia: Baja. Mejor Para: Traders aversos al riesgo enfocados en pares principales como BTC/USDT.',
        winRate: '80%',
        riskReward: '1:1+'
      },
      moderate: {
        title: 'Moderada (Por Defecto)',
        description: 'Criterios: 4/5 condiciones (RSI <40/>60, ADX >15, SQZMOM ≠0, diff DMI >3, ATR >50). Frecuencia: Balanceada. Mejor Para: Traders diarios en pares de prioridad media como XRP/USDT.',
        winRate: 'Buena',
        riskReward: '1:1 mín'
      },
      aggressive: {
        title: 'Agresiva',
        description: 'Criterios: Relajados (ADX >10, filtros mínimos DMI/ATR). Frecuencia: Alta. Mejor Para: Traders de alto volumen en altcoins como SOL/USDT.',
        winRate: 'Más Trades',
        riskReward: 'Riesgo Mayor'
      },
      specialized: {
        title: 'SQZMOM + ADX Especializada',
        description: 'Criterios: Enfoque en momentum de squeeze con ADX para detección de rupturas. Mejor Para: Jugadas de volatilidad en pares de baja prioridad como ADA/USDT.',
        winRate: 'Excelente',
        riskReward: '3x ATR'
      },
      buttons: {
        select: 'Seleccionar Estrategia',
        backtest: 'Hacer Backtest'
      }
    },

    // Education Section
    education: {
      title: 'Centro de Educación: Aprende a Tradear Como un Pro',
      description: 'Para empoderar a los usuarios, hemos añadido un hub educativo dedicado. Esto aborda la falta de recursos de aprendizaje, enfocándose en indicadores, estrategias y mejores prácticas.',
      indicators: {
        ema55: {
          title: 'EMA55',
          description: 'Aprende cómo esta media móvil exponencial de 55 períodos identifica tendencias.',
          video: 'Detectando Cruces Alcistas'
        },
        rsi: {
          title: 'RSI (14)',
          description: 'Detecta niveles de sobrecompra/sobreventa con el Índice de Fuerza Relativa.',
          video: 'Herramienta Calculadora Interactiva'
        },
        adx: {
          title: 'ADX y DMI',
          description: 'Mide la fuerza y dirección de la tendencia con el Índice Direccional Promedio.',
          video: 'Ejemplos Reales de Cripto'
        },
        sqzmom: {
          title: 'SQZMOM',
          description: 'Detecta squeezes de momentum para oportunidades de ruptura.',
          video: 'Estudio de Caso Squeeze BTC'
        },
        atr: {
          title: 'ATR',
          description: 'Entiende la volatilidad para colocación óptima de stop-loss.',
          video: 'Hoja de Cálculo de ATR'
        }
      },
      resources: {
        basics: {
          title: 'Conceptos Básicos de Trading',
          items: [
            '"Trading de Cripto 101" – Desde wallets hasta exchanges',
            'Tópicos Avanzados: Gestión de riesgo, trampas del backtesting',
            'Educación de Estrategias: Construyendo Tu Primera Estrategia Moderada'
          ]
        },
        community: {
          title: 'Recursos',
          items: [
            'Glosario: 50+ términos explicados (OHLCV, Cronjob)',
            'Blog y Videos: Posts semanales sobre tendencias 2025',
            'Foro Comunitario: Discute estrategias con otros usuarios'
          ]
        }
      },
      certification: {
        title: 'Curso Gratuito de Certificación',
        description: '"Trading Cuantitativo de Cripto" – Curso auto-paced con quizzes y badges. Aprende a evitar trampas comunes como el overtrading.',
        features: ['Certificado al completar', 'Q&A moderado por comunidad', 'Webinars en vivo semanales'],
        cta: 'Comenzar a Aprender'
      }
    },

    // Services Section
    services: {
      title: '¿Por Qué Elegir TradeIA?',
      description: 'Únete a miles de traders que confían en TradeIA para señales de trading automatizadas y basadas en datos para criptomonedas',
      items: {
        marketData: {
          title: 'Datos de Mercado en Tiempo Real',
          description: 'Integración directa con API de Binance para datos de mercado de criptomonedas en vivo y generación instantánea de señales.'
        },
        signals: {
          title: 'Generación Automatizada de Señales',
          description: 'Algoritmos impulsados por IA analizan múltiples indicadores para generar señales precisas de compra/venta con puntos de entrada/salida.'
        },
        risk: {
          title: 'Gestión de Riesgo',
          description: 'Niveles integrados de stop-loss y take-profit con dimensionamiento dinámico de posiciones basado en tu tolerancia al riesgo.'
        },
        backtesting: {
          title: 'Backtesting y Simulación',
          description: 'Prueba estrategias contra datos históricos con métricas comprehensivas y modo de paper trading.'
        },
        mobile: {
          title: 'Acceso Móvil y Web',
          description: 'Monitorea tu portafolio y señales en cualquier lugar con nuestro dashboard responsivo y notificaciones móviles.'
        },
        api: {
          title: 'Integración API',
          description: 'API RESTful con webhooks para integración seamless con tus bots de trading y aplicaciones.'
        }
      },
      cta: {
        title: '¿Listo para Comenzar a Tradear de Manera Más Inteligente?',
        description: 'Únete a TradeIA hoy y transforma tu trading de criptomonedas con señales impulsadas por IA, educación comprehensiva y herramientas de grado profesional.',
        trial: 'Comenzar Prueba Gratuita',
        demo: 'Ver Demo'
      }
    },

    // Getting Started Section
    gettingStarted: {
      title: 'Comienza a Tradear en 3 Pasos Simples',
      description: 'Pon en marcha las señales de trading automatizadas de TradeIA en solo unos minutos.',
      steps: {
        account: {
          title: 'Crea Tu Cuenta',
          description: 'Regístrate gratis y verifica tu email para acceder a la plataforma.',
          action: 'Registrarse Ahora'
        },
        strategy: {
          title: 'Elige Tu Estrategia',
          description: 'Selecciona entre estrategias Conservadoras, Moderadas o Agresivas basadas en tu tolerancia al riesgo.',
          action: 'Ver Estrategias'
        },
        signals: {
          title: 'Comienza a Recibir Señales',
          description: 'Comienza a recibir señales de trading automatizadas. valida estrategias con el backtesting y comienza a tradear.',
          action: 'Comenzar Ahora'
        }
      },
      resources: {
        title: '¿Listo para Tradear?',
        description: 'Comienza a recibir señales de trading automatizadas con nuestra plataforma comprehensiva.',
        trial: 'Comenzar Ahora',
        docs: 'Documentación API',
        education: 'Centro de Educación'
      },
      bottom: {
        title: 'Únete a Miles de Traders Exitosos',
        description: 'TradeIA es confiado por traders de cripto alrededor del mundo para señales automatizadas confiables y herramientas comprehensivas.',
        signup: 'Comenzar a Tradear Ahora',
        dashboard: 'Iniciar Sesión al Dashboard →'
      }
    }
  }
};

export type TranslationKey = keyof typeof translations.en;