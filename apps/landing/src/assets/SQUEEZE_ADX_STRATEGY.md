# Estrategia Squeeze Momentum + ADX

## 📊 Reglas de Entrada

### Condiciones Comunes:
- **Timeframe recomendado:** 4H
- **ADX > 30** para confirmar tendencia fuerte
- **Sin divergencias** en las últimas 5 velas

### Señal de Compra (LONG):
1. **Squeeze Momentum cambia de rojo (-1) a verde (1)**
   - `sqzmom_prev <= -1 and sqzmom_current >= 1`
   - Confirmación de impulso alcista

2. **Verificación de divergencias:**
   - No debe haber divergencia bajista en las últimas 5 velas
   - Se considera divergencia bajista cuando el precio hace máximos más altos pero el SQZMOM hace máximos más bajos

### Señal de Venta (SHORT):
1. **Squeeze Momentum cambia de verde (1) a rojo (-1)**
   - `sqzmom_prev >= 1 and sqzmom_current <= -1`
   - Confirmación de cambio de tendencia

2. **Verificación de divergencias:**
   - No debe haber divergencia alcista en las últimas 5 velas
   - Se considera divergencia alcista cuando el precio hace mínimos más bajos pero el SQZMOM hace mínimos más altos

## ⚙️ Parámetros de Riesgo

### Para todas las operaciones:
- **Take Profit:** 2% del precio de entrada
- **Stop Loss:** 1% del precio de entrada
- **Ratio Riesgo/Beneficio:** 1:2
- **Tamaño de posición:** 1-2% del capital por operación

### Cálculo de Niveles:
- **Compra (LONG):**
  - Entrada: Precio de cierre actual
  - Take Profit: `precio_entrada * 1.02` (2% arriba)
  - Stop Loss: `precio_entrada * 0.99` (1% abajo)

- **Venta (SHORT):**
  - Entrada: Precio de cierre actual
  - Take Profit: `precio_entrada * 0.98` (2% abajo)
  - Stop Loss: `precio_entrada * 1.01` (1% arriba)

## 🔍 Detección de Divergencias

### Divergencia Alcista (Señal de Compra):
```python
# Precio hace mínimos más bajos pero SQZMOM hace mínimos más altos
price_lows_decreasing = all(prices[i] > prices[i+1] for i in range(len(prices)-1))
sqzmom_lows_increasing = all(sqzmom[i] < sqzmom[i+1] for i in range(len(sqzmom)-1))
divergence = price_lows_decreasing and sqzmom_lows_increasing
```

### Divergencia Bajista (Señal de Venta):
```python
# Precio hace máximos más altos pero SQZMOM hace máximos más bajos
price_highs_increasing = all(prices[i] < prices[i+1] for i in range(len(prices)-1))
sqzmom_highs_decreasing = all(sqzmom[i] > sqzmom[i+1] for i in range(len(sqzmom)-1))
divergence = price_highs_increasing and sqzmom_highs_decreasing
```

## 📊 Estructura de la Señal

Cada señal generada contiene la siguiente información:

```python
{
    'symbol': 'BTC/USDT',         # Par de trading
    'timeframe': '4h',           # Timeframe de la señal
    'signal_type': 'BUY/SELL',   # Tipo de señal
    'entry_price': float,        # Precio de entrada
    'take_profit': float,        # Precio de take profit
    'stop_loss': float,          # Precio de stop loss
    'timestamp': datetime,       # Marca de tiempo
    'indicators': {              # Valores de los indicadores
        'adx': float,           # Valor actual del ADX
        'sqzmom': float,        # Valor actual del Squeeze Momentum
        'sqzmom_prev': float    # Valor anterior del Squeeze Momentum
    },
    'reason': str                # Razón de la señal
}
```

## 📊 Ejemplo Visual

```
Precio:   ▲
          │
          │      TP2
          │     /
          │    /
          │   /  TP1
          │  /  /
          │ /  /
Entrada:  ├──┘
          │
          │
          └─────────────────► Tiempo

Squeeze:  [R][R][R][V][V][V]  (R=Rojo, V=Verde)
ADX:      [28][30][32][35][38][40]  (>30 = Tendencia)
```

## 📝 Notas Importantes
- Esta estrategia funciona mejor en mercados con tendencia definida
- Evitar operar en rangos laterales estrechos
- Realizar backtesting antes de usar en cuenta real
- Ajustar parámetros según el par de trading y condiciones de mercado
