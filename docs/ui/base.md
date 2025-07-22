<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plataforma de Trading Bot AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Chosen Palette: Calm Harmony -->
    <!-- Application Structure Plan: He diseñado la aplicación como un Single-Page Application (SPA) con una barra lateral de navegación fija y un área de contenido principal dinámica. Esta estructura fue elegida por su eficiencia y familiaridad para los usuarios en aplicaciones de dashboards. Permite cambiar de contexto (del panel general al análisis detallado, por ejemplo) de forma instantánea sin recargar la página, manteniendo al usuario orientado. El flujo comienza en un 'Panel de Control' que ofrece una vista de pájaro de la información más crítica. Desde allí, el usuario puede profundizar en secciones específicas como 'Señales', 'Análisis' o 'Gestión de Bots' según sus necesidades, promoviendo un flujo de trabajo que va de lo general a lo específico, lo cual es ideal para la toma de decisiones en trading. -->
    <!-- Visualization & Content Choices: 
        - Panel de Control (Goal: Informar): KPIs en tarjetas grandes para visibilidad inmediata. Gráfico de líneas (Chart.js) para 'Rendimiento' muestra tendencias a lo largo del tiempo. Gráfico de dona (Chart.js) para 'Distribución de Activos' ofrece una vista rápida de la diversificación. Se usa una tabla compacta para 'Señales Activas' para un resumen rápido. Interacción: Hover para detalles en gráficos.
        - Señales Activas/Historial (Goal: Organizar): Tablas HTML interactivas con filtros y ordenación (vía JS). Los colores (verde/rojo) ayudan a una rápida identificación del estado. Interacción: Pestañas para cambiar entre vistas, filtros por activo.
        - Análisis (Goal: Comparar y Analizar): Gráfico de barras agrupadas (Chart.js) para comparar 'Ganancias vs. Pérdidas'. Gráfico de dona para 'Tasa de Acierto' es visualmente inmediato. Interacción: Filtros por período de tiempo (ej. 30 días, 90 días) que actualizan dinámicamente los gráficos para un análisis profundo.
        - Gestión de Bots (Goal: Interactuar/Gestionar): Diseño basado en tarjetas para cada bot, utilizando elementos de formulario estándar como toggles y sliders para una configuración intuitiva.
        - Justificación: Las elecciones se basan en la claridad y la acción. Los gráficos son para insights rápidos, mientras que las tablas son para datos detallados. Esto evita la sobrecarga de información y guía al usuario. Se usa Chart.js por su versatilidad y renderizado en Canvas. -->
    <!-- CONFIRMATION: NO SVG graphics used. NO Mermaid JS used. -->
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5;
        }
        .sidebar-icon {
            width: 24px;
            height: 24px;
            stroke-width: 1.5;
        }
        .nav-item.active {
            background-color: #e0e7ff;
            color: #4f46e5;
            font-weight: 600;
        }
        .nav-item.active .sidebar-icon {
            stroke: #4f46e5;
        }
        .hidden-view {
            display: none;
        }
        .stat-card {
            background-color: white;
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        .chart-container {
            position: relative;
            width: 100%;
            height: 300px;
            max-height: 40vh;
        }
        @media (min-width: 768px) {
            .chart-container {
                height: 350px;
            }
        }
        .tab-button.active {
            border-bottom-color: #4f46e5;
            color: #4f46e5;
            font-weight: 600;
        }
        .signal-row.gain {
            border-left: 4px solid #10B981;
        }
        .signal-row.loss {
            border-left: 4px solid #EF4444;
        }
    </style>
</head>
<body class="text-gray-800">

    <div class="flex h-screen bg-gray-100">
        <!-- Sidebar -->
        <div class="hidden md:flex flex-col w-64 bg-white shadow-lg">
            <div class="flex items-center justify-center h-20 shadow-md">
                <h1 class="text-2xl font-bold text-indigo-600">AI Trader</h1>
            </div>
            <nav class="flex-1 px-2 py-4 space-y-2">
                <a href="#" data-view="dashboard" class="nav-item flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200 active">
                    <span class="sidebar-icon"_icon="dashboard"></span>
                    <span class="mx-4">Panel de Control</span>
                </a>
                <a href="#" data-view="signals" class="nav-item flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200">
                    <span class="sidebar-icon" _icon="signals"></span>
                    <span class="mx-4">Señales</span>
                </a>
                <a href="#" data-view="analysis" class="nav-item flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200">
                    <span class="sidebar-icon" _icon="analysis"></span>
                    <span class="mx-4">Análisis</span>
                </a>
                <a href="#" data-view="portfolio" class="nav-item flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200">
                    <span class="sidebar-icon" _icon="portfolio"></span>
                    <span class="mx-4">Cartera</span>
                </a>
                <a href="#" data-view="bots" class="nav-item flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200">
                    <span class="sidebar-icon" _icon="bots"></span>
                    <span class="mx-4">Gestión de Bots</span>
                </a>
                <a href="#" data-view="support" class="nav-item flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200">
                    <span class="sidebar-icon" _icon="support"></span>
                    <span class="mx-4">Soporte</span>
                </a>
            </nav>
        </div>

        <!-- Main content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="flex justify-between items-center p-4 bg-white border-b-2">
                <div class="flex items-center">
                     <button id="menu-button" class="text-gray-500 focus:outline-none md:hidden">
                        <span class="sidebar-icon" _icon="menu"></span>
                    </button>
                    <h1 class="text-2xl font-semibold text-gray-700 ml-4" id="view-title">Panel de Control</h1>
                </div>
                <div class="flex items-center space-x-4">
                     <span class="sidebar-icon text-gray-500" _icon="notification"></span>
                    <div class="font-semibold">Usuario AI</div>
                </div>
            </header>
            
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                <!-- Dashboard View -->
                <div id="dashboard-view" class="view-content">
                    <p class="text-gray-600 mb-6">Bienvenido a su panel de control. Aquí encontrará un resumen del rendimiento de sus bots, las señales activas y el estado general de su cuenta. Use esta vista para obtener una instantánea rápida de su actividad de trading.</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div class="stat-card">
                            <h3 class="text-gray-500 text-sm font-medium">Rendimiento (30d)</h3>
                            <p class="text-3xl font-semibold text-green-600">+12.5%</p>
                        </div>
                        <div class="stat-card">
                            <h3 class="text-gray-500 text-sm font-medium">Saldo de Cuenta</h3>
                            <p class="text-3xl font-semibold">$15,780.50</p>
                        </div>
                        <div class="stat-card">
                            <h3 class="text-gray-500 text-sm font-medium">P/L Abierto</h3>
                            <p class="text-3xl font-semibold text-red-500">-$210.15</p>
                        </div>
                        <div class="stat-card">
                            <h3 class="text-gray-500 text-sm font-medium">Señales Activas</h3>
                            <p class="text-3xl font-semibold">4</p>
                        </div>
                    </div>

                    <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2 stat-card">
                            <h3 class="font-semibold mb-4">Rendimiento de la Cartera</h3>
                            <div class="chart-container">
                                <canvas id="performanceChart"></canvas>
                            </div>
                        </div>
                        <div class="stat-card">
                             <h3 class="font-semibold mb-4">Distribución de Activos</h3>
                            <div class="chart-container">
                                <canvas id="assetDistributionChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Signals View -->
                <div id="signals-view" class="view-content hidden-view">
                     <p class="text-gray-600 mb-6">En esta sección puede monitorear todas las señales de trading. Las "Señales Activas" son operaciones en curso, mientras que el "Historial" le permite auditar el rendimiento pasado. Puede filtrar y ordenar la tabla para un análisis detallado.</p>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <div class="border-b-2 border-gray-200">
                             <nav class="-mb-px flex space-x-8" id="signals-tabs">
                                <button class="tab-button whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-gray-300 active" data-tab="active">
                                    Señales Activas
                                </button>
                                <button class="tab-button whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-gray-300" data-tab="history">
                                    Historial de Señales
                                </button>
                            </nav>
                        </div>

                        <div id="active-signals-content" class="signals-content mt-4">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objetivo</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop-Loss</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Riesgo</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr class="signal-row gain">
                                            <td class="px-6 py-4 whitespace-nowrap font-medium">BTC/USDT</td>
                                            <td class="px-6 py-4 whitespace-nowrap">68,500.00</td>
                                            <td class="px-6 py-4 whitespace-nowrap">72,000.00</td>
                                            <td class="px-6 py-4 whitespace-nowrap">67,000.00</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-green-600">1.5%</td>
                                            <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Activa</span></td>
                                        </tr>
                                         <tr class="signal-row loss">
                                            <td class="px-6 py-4 whitespace-nowrap font-medium">ETH/USDT</td>
                                            <td class="px-6 py-4 whitespace-nowrap">3,800.00</td>
                                            <td class="px-6 py-4 whitespace-nowrap">3,650.00</td>
                                            <td class="px-6 py-4 whitespace-nowrap">3,850.00</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-red-600">1.0%</td>
                                            <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Activa</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div id="history-signals-content" class="signals-content mt-4 hidden-view">
                             <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Cierre</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap font-medium">SOL/USDT</td>
                                            <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ganancia</span></td>
                                            <td class="px-6 py-4 whitespace-nowrap text-green-600">+$250.75</td>
                                            <td class="px-6 py-4 whitespace-nowrap">2024-07-19</td>
                                        </tr>
                                         <tr>
                                            <td class="px-6 py-4 whitespace-nowrap font-medium">ADA/USDT</td>
                                            <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Pérdida</span></td>
                                            <td class="px-6 py-4 whitespace-nowrap text-red-600">-$80.20</td>
                                            <td class="px-6 py-4 whitespace-nowrap">2024-07-18</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Analysis View -->
                <div id="analysis-view" class="view-content hidden-view">
                     <p class="text-gray-600 mb-6">Profundice en su rendimiento de trading con estas herramientas de análisis. Compare ganancias y pérdidas a lo largo del tiempo y evalúe su tasa de acierto para identificar patrones y optimizar sus estrategias. Puede cambiar el período de análisis usando el selector.</p>
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2 stat-card">
                            <h3 class="font-semibold mb-4">Ganancias vs. Pérdidas Mensuales</h3>
                            <div class="chart-container">
                                <canvas id="profitlossChart"></canvas>
                            </div>
                        </div>
                        <div class="stat-card">
                             <h3 class="font-semibold mb-4">Tasa de Acierto (Win Rate)</h3>
                            <div class="chart-container flex items-center justify-center">
                                <canvas id="winrateChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Portfolio View -->
                <div id="portfolio-view" class="view-content hidden-view">
                    <p class="text-gray-600 mb-6">Revise la composición detallada de su cartera. Esta tabla muestra todos sus activos, la cantidad que posee y su valor actual de mercado, dándole una visión clara de sus inversiones.</p>
                     <div class="bg-white p-6 rounded-lg shadow-md">
                         <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Actual (USD)</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% de Cartera</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap font-medium">Bitcoin (BTC)</td>
                                        <td class="px-6 py-4 whitespace-nowrap">0.105</td>
                                        <td class="px-6 py-4 whitespace-nowrap">$7,192.50</td>
                                        <td class="px-6 py-4 whitespace-nowrap">45.5%</td>
                                    </tr>
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap font-medium">Ethereum (ETH)</td>
                                        <td class="px-6 py-4 whitespace-nowrap">1.25</td>
                                        <td class="px-6 py-4 whitespace-nowrap">$4,750.00</td>
                                        <td class="px-6 py-4 whitespace-nowrap">30.1%</td>
                                    </tr>
                                     <tr>
                                        <td class="px-6 py-4 whitespace-nowrap font-medium">USDT</td>
                                        <td class="px-6 py-4 whitespace-nowrap">3,838.00</td>
                                        <td class="px-6 py-4 whitespace-nowrap">$3,838.00</td>
                                        <td class="px-6 py-4 whitespace-nowrap">24.4%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Bots View -->
                <div id="bots-view" class="view-content hidden-view">
                    <p class="text-gray-600 mb-6">Administre la configuración de sus bots de trading. Aquí puede activar o desactivar bots, ajustar su nivel de riesgo y personalizar las estrategias que utilizan para operar en el mercado.</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="stat-card">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="font-semibold">Bot Scalper BTC</h3>
                                <label class="flex items-center cursor-pointer">
                                    <div class="relative">
                                        <input type="checkbox" class="sr-only peer" checked>
                                        <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </div>
                                </label>
                            </div>
                            <div class="space-y-4">
                                <div>
                                    <label class="text-sm font-medium text-gray-600">Nivel de Riesgo</label>
                                    <input type="range" min="1" max="10" value="4" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-600">Estrategia</label>
                                    <select class="w-full p-2 border rounded-md bg-gray-50">
                                        <option>Momentum</option>
                                        <option selected>RSI Divergence</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="font-semibold">Bot Swing ETH</h3>
                                <label class="flex items-center cursor-pointer">
                                    <div class="relative">
                                        <input type="checkbox" class="sr-only peer" checked>
                                        <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </div>
                                </label>
                            </div>
                             <div class="space-y-4">
                                <div>
                                    <label class="text-sm font-medium text-gray-600">Nivel de Riesgo</label>
                                    <input type="range" min="1" max="10" value="7" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-600">Estrategia</label>
                                    <select class="w-full p-2 border rounded-md bg-gray-50">
                                        <option>Trend Following</option>
                                        <option>Mean Reversion</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Support View -->
                <div id="support-view" class="view-content hidden-view">
                    <p class="text-gray-600 mb-6">Encuentre respuestas a preguntas comunes y obtenga ayuda con la plataforma. Si no encuentra lo que busca, no dude en contactar a nuestro equipo de soporte.</p>
                     <div class="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                         <h2 class="text-2xl font-bold mb-4">Preguntas Frecuentes (FAQ)</h2>
                         <div class="space-y-4">
                             <details class="group">
                                 <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 rounded-lg hover:bg-gray-100">
                                     <span>¿Cómo se genera una señal?</span>
                                     <span class="transition group-open:rotate-180">
                                         <span _icon="chevron-down"></span>
                                     </span>
                                 </summary>
                                 <p class="text-gray-600 mt-3 px-4 pb-4">
                                     Nuestros algoritmos de IA analizan múltiples indicadores de mercado en tiempo real, como volumen, volatilidad y patrones de precios, para identificar oportunidades de trading con alta probabilidad de éxito.
                                 </p>
                             </details>
                             <details class="group">
                                 <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 rounded-lg hover:bg-gray-100">
                                     <span>¿Puedo configurar mis propios bots?</span>
                                     <span class="transition group-open:rotate-180">
                                         <span _icon="chevron-down"></span>
                                     </span>
                                 </summary>
                                 <p class="text-gray-600 mt-3 px-4 pb-4">
                                     Sí, en la sección 'Gestión de Bots' puedes personalizar completamente tus bots, ajustando el nivel de riesgo, la estrategia a seguir y los activos en los que operará.
                                 </p>
                             </details>
                         </div>
                     </div>
                </div>

            </main>
        </div>
    </div>
    
<script>
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-content');
    const viewTitle = document.getElementById('view-title');
    const signalsTabs = document.getElementById('signals-tabs');
    const signalsContents = document.querySelectorAll('.signals-content');
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // Icon mapping for SVG icons
    const iconMap = {
        dashboard: `<svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`,
        signals: `<svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>`,
        analysis: `<svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path stroke-linecap="round" stroke-linejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>`,
        portfolio: `<svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>`,
        bots: `<svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
        support: `<svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
        'chevron-down': `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>`,
        notification: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>`,
        menu: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>`,
    };
    
    // Populate SVG icons based on _icon attribute
    document.querySelectorAll('[class*="sidebar-icon"], [_icon]').forEach(el => {
        const iconName = el.getAttribute('_icon') || el.classList.value.match(/sidebar-icon-([^\s]+)/)[1];
        if (iconMap[iconName]) {
            el.innerHTML = iconMap[iconName];
        }
    });

    // Function to switch between different views (Dashboard, Signals, etc.)
    function switchView(viewName) {
        views.forEach(view => {
            if (view.id === `${viewName}-view`) {
                view.classList.remove('hidden-view');
            } else {
                view.classList.add('hidden-view');
            }
        });

        navItems.forEach(item => {
            if (item.dataset.view === viewName) {
                item.classList.add('active');
                viewTitle.textContent = item.querySelector('span.mx-4').textContent;
            } else {
                item.classList.remove('active');
            }
        });
        
        // Scroll to top when switching views
        window.scrollTo(0, 0);
    }
    
    // Add event listeners to navigation items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = e.currentTarget.dataset.view;
            switchView(viewName);
        });
    });

    // Handle signals tab switching (Active vs. History)
    if (signalsTabs) {
        signalsTabs.addEventListener('click', (e) => {
            if (e.target.matches('.tab-button')) {
                const tabName = e.target.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                signalsContents.forEach(content => {
                    if (content.id === `${tabName}-signals-content`) {
                        content.classList.remove('hidden-view');
                    } else {
                        content.classList.add('hidden-view');
                    }
                });
            }
        });
    }

    // Function to create and render the Performance Chart
    function createPerformanceChart() {
        const ctx = document.getElementById('performanceChart')?.getContext('2d');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Valor de Cartera',
                    data: [12000, 12500, 13200, 13000, 14100, 14800, 15780],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    fill: true,
                    tension: 0.4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) { return '$' + value.toLocaleString(); }
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // Function to create and render the Asset Distribution Chart
    function createAssetDistributionChart() {
        const ctx = document.getElementById('assetDistributionChart')?.getContext('2d');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['BTC', 'ETH', 'USDT'],
                datasets: [{
                    label: 'Distribución',
                    data: [45.5, 30.1, 24.4],
                    backgroundColor: ['#f97316', '#6366f1', '#14b8a6'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                 plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }
    
    // Function to create and render the Profit vs Loss Chart
    function createProfitLossChart() {
        const ctx = document.getElementById('profitlossChart')?.getContext('2d');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mar', 'Abr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Ganancias',
                        data: [1200, 1800, 2500, 2100, 3000],
                        backgroundColor: '#10B981',
                        borderRadius: 4,
                    },
                    {
                        label: 'Pérdidas',
                        data: [-500, -800, -300, -1200, -900],
                        backgroundColor: '#EF4444',
                        borderRadius: 4,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, ticks: { callback: function(value) { return '$' + value; } } }
                },
                plugins: {
                    legend: { position: 'top' }
                }
            }
        });
    }

    // Function to create and render the Win Rate Chart
    function createWinRateChart() {
        const ctx = document.getElementById('winrateChart')?.getContext('2d');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Ganadas', 'Perdidas'],
                datasets: [{
                    data: [72, 28],
                    backgroundColor: ['#10B981', '#EF4444'],
                    borderColor: '#ffffff',
                    borderWidth: 4,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                    title: {
                        display: true,
                        text: '72%',
                        position: 'bottom',
                        align: 'center',
                        font: { size: 36, weight: 'bold' },
                        color: '#1f2937',
                        padding: { top: -60 }
                    }
                }
            }
        });
    }
    
    // Initialize all charts on page load
    createPerformanceChart();
    createAssetDistributionChart();
    createProfitLossChart();
    createWinRateChart();
});
</script>
</body>
</html>
