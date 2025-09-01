# Estrategia de Trading Actual - Resumen Conciso

## 🎯 **Descripción General**

Sistema de trading cuantitativo automatizado para criptomonedas que genera señales de entrada basadas en indicadores técnicos y análisis de mercado. **Enfoque principal: Timeframe 4H** para señales de alta calidad.

### Estrategias Disponibles:
1. **Conservadora**: Enfoque estricto que requiere múltiples confirmaciones (todas las condiciones deben cumplirse).
2. **Moderada**: Equilibrio entre calidad y frecuencia (3 de 5 condiciones requeridas).
3. **Agresiva**: Mayor frecuencia de señales con menos confirmaciones.
4. **Squeeze+ADX**: Estrategia basada en el indicador Squeeze Momentum y ADX para identificar tendencias fuertes.

> Nota para desarrolladores: la especificación técnica detallada de estrategias, umbrales y esquema de señales está en [STRATEGIES_DEV_REFERENCE.md](./STRATEGIES_DEV_REFERENCE.md).

## 📊 **Indicadores Técnicos Utilizados**

### **Estrategia Squeeze+ADX:**
- **Squeeze Momentum**: Identifica períodos de compresión del mercado y cambios en el momentum.
- **ADX**: Índice direccional promedio para confirmar la fuerza de la tendencia.
- **Divergencias**: Análisis de divergencias en las últimas 5 velas para confirmar señales.

### **Indicadores Principales:**
- **EMA55**: Media móvil exponencial de 55 períodos (soporte/resistencia dinámico)
- **RSI**: Índice de fuerza relativa de 14 períodos (sobreventa/sobrecompra)
- **ADX**: Índice direccional promedio de 14 períodos (fuerza de tendencia)
- **DMI+/-**: Indicadores de movimiento direccional (dirección de tendencia)
- **SQZMOM**: Indicador de momentum de compresión (momentum y volatilidad)
- **ATR**: Rango verdadero promedio de 14 períodos (volatilidad)

### **Cálculo de Indicadores:**
```python
# Ejemplo de implementación actual
ema55 = talib.EMA(closes, timeperiod=55)
rsi = talib.RSI(closes, timeperiod=14)
dmi_plus = talib.PLUS_DI(highs, lows, closes, timeperiod=14)
dmi_minus = talib.MINUS_DI(highs, lows, closes, timeperiod=14)
adx = talib.ADX(highs, lows, closes, timeperiod=14)
sqzmom = calculate_sqzmom(closes)  # Implementación personalizada
atr = talib.ATR(highs, lows, closes, timeperiod=14)
```

## 🎯 **Criterios de Señales (Estrictos)**

### **Condiciones Requeridas (4 de 5):**
1. **RSI**: < 30 (sobreventa extrema) o > 70 (sobrecompra extrema)
2. **ADX**: > 25 (tendencia fuerte)
3. **SQZMOM**: > 10 (momentum fuerte) o diferencia DMI > 12
4. **DMI**: Diferencia > 8 entre DMI+ y DMI-
5. **ATR**: > 50 (volatilidad mínima)

### **Filtros de Calidad:**
- **Ventana temporal**: 12 horas mínimo entre señales 4H
- **Límite por par**: Máximo 1 señal por par/timeframe
- **Ratio riesgo/beneficio**: Mínimo 1.0:1
- **Eliminación de duplicados**: Señales idénticas filtradas

## 🎯 **Estrategia Squeeze+ADX**

### **Condiciones de Entrada:**
1. **Señal de Compra:**
   - Cambio de Squeeze Momentum de rojo a verde
   - ADX > 30 (tendencia fuerte)
   - Sin divergencias en las últimas 5 velas

2. **Señal de Venta:**
   - Cambio de Squeeze Momentum de verde a rojo
   - ADX > 30 (tendencia fuerte)
   - Sin divergencias en las últimas 5 velas

### **Gestión de Riesgo:**
- **Take Profit:** 2% del precio de entrada
- **Stop Loss:** 1% del precio de entrada
- **Ratio Riesgo/Beneficio:** 1:2

## 📈 **Escenarios de Mercado**

### **1. Tendencia Fuerte (Onda 3 o 5)**
- **Contexto**: Identificación de ondas de Elliott completadas
- **Condiciones**: EMA55 como soporte/resistencia, ADX > 25, DMI confirmado
- **Señal**: BUY en rebote de EMA55 con momentum alcista

### **2. Reversión (Onda C o Post-Impulso)**
- **Contexto**: Finalización de ondas impulsivas o correctivas
- **Condiciones**: Rechazo en EMA55, ADX > 25, DMI inverso
- **Señal**: SELL en rechazo de EMA55 con momentum bajista

### **3. Consolidación/Ruptura**
- **Contexto**: Mercado lateral o fase correctiva compleja
- **Condiciones**: EMA55 plana, ADX < 20, SQZMOM en squeeze
- **Señal**: BUY/SELL en ruptura con confirmación de momentum

## 💰 **Gestión de Riesgo**

### **Cálculo de Objetivos:**
```python
# Objetivos basados en ATR
tp1 = entry_price + (atr_value * 2)  # Toma de ganancias parcial
tp2 = entry_price + (atr_value * 4)  # Objetivo final

# Stop-Loss basado en ATR
stop_loss = entry_price - (atr_value * 1.5)
```

### **Gestión de Posición:**
- **Entrada**: 100% de la posición
- **TP1**: Cerrar 50% de la posición
- **TP2**: Cerrar posición restante
- **Stop-Loss**: Salida total si se alcanza

## ⚙️ **Configuración del Sistema**

### **Timeframes Configurados:**
- **4H**: Principal (cada 4 horas) - Enfoque en señales
- **1H**: Secundario (cada hora) - Análisis complementario
- **1M**: Opcional (cada 5 min) - Análisis detallado (deshabilitado)

### **Pares Soportados:**
- BTC/USDT
- LINK/USDT

### **Frecuencia de Señales Esperada:**
- **0-1 señal por día por par**
- **Días sin señales en mercados laterales**
- **Calidad sobre cantidad**

## 🚀 **Comandos Principales**

### **Poblar Datos Históricos:**
```bash
curl -X POST "http://localhost:8000/market-data/populate-historical?symbol=BTC/USDT&timeframe=4h&start_date=2025-07-01T00:00:00&end_date=2025-07-25T23:59:59"
```

### **Generar Señales:**
```bash
curl -X POST "http://localhost:8000/signals/generate?symbol=BTC/USDT&timeframe=4h"
```

### **Backtest:**
```bash
curl -X POST "http://localhost:8000/backtest/run?symbol=BTC/USDT&timeframe=4h&start_date=2025-07-01T00:00:00&end_date=2025-07-25T23:59:59"
```

## 📊 **Ejemplo de Señal de Calidad**

```json
{
  "Activo": "BTC/USDT",
  "Entrada": 60000.0,
  "Objetivo": {
    "TP1": 61200.0,
    "TP2": 63000.0
  },
  "Stop-Loss": 58800.0,
  "Riesgo": "1.5%",
  "Estado": "Activa",
  "Tipo": "BUY",
  "timeframe": "4h",
  "timestamp": "2025-07-25T12:00:00",
  "signal_type": "entry",
  "reason": "RSI < 30 (sobreventa extrema), ADX > 25 (tendencia fuerte), SQZMOM = 15.0 (momentum fuerte), DMI confirmado (diferencia > 8), Volatilidad adecuada",
  "market_scenario": "tendencia fuerte alcista"
}
```

## 🎯 **Ventajas del Sistema Actual**

### **Eficiencia:**
- **97.9% menos llamadas a la API** (de 2,940 a 60 por día)
- **Menos carga en servidor** y base de datos
- **Optimización de recursos** CPU

### **Calidad:**
- **Solo señales con condiciones extremas**
- **Menos ruido** y señales falsas
- **Mejor ratio riesgo/beneficio**
- **Timing optimizado** (12 horas mínimo entre señales)

### **Diversidad:**
- **Señales BUY y SHORT** según condiciones
- **Basado en escenarios reales** de mercado
- **No más señales todas del mismo tipo**

## ⚠️ **Consideraciones Importantes**

### **Expectativas Realistas:**
- **Patiencia**: Es normal que no haya señales frecuentes
- **Calidad sobre cantidad**: Mejor 1 señal de calidad que 5 de baja calidad
- **Monitoreo**: Revisar cada 4-6 horas

### **Limitaciones:**
- **Dependencia de condiciones extremas** de mercado
- **Menos señales** en mercados laterales
- **Requiere validación** con backtesting histórico

## 🔄 **Estado Actual**

### **✅ Implementado:**
- Criterios estrictos para señales
- Filtros de calidad mejorados
- Configuración optimizada para 4H
- Tests de validación exitosos
- Documentación completa

### **🚀 Próximos Pasos:**
- Backtesting con datos históricos
- Análisis de rendimiento de señales
- Optimización de parámetros según resultados
- Implementación de notificaciones

---

**El sistema está optimizado para generar señales de alta calidad con timeframe 4H, priorizando la calidad sobre la cantidad y la eficiencia de recursos.** 