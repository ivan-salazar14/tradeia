import { NextRequest, NextResponse } from 'next/server';
import { pubsubClient, SignalEvent, SignalEventPayload } from '@/lib/pubsub/client';

/**
 * Endpoint para publicar eventos de señal en Pub/Sub
 * 
 * Este endpoint permite publicar eventos de señales directamente en la cola de Pub/Sub.
 * Es útil para testing y para que servicios externos publiquen señales.
 * 
 * POST /api/notifications/publish
 * 
 * Body (formato directo):
 * {
 *   "symbol": "BTC/USDT",
 *   "timeframe": "4h",
 *   "timestamp": "2026-02-26T15:15:00Z",
 *   "signal_type": "entry",
 *   "signal_direction": "BUY",
 *   "strategy_id": "moderate",
 *   "reason": "External signal from TradingView",
 *   "entry": 45000.0,
 *   "tp1": 46000.0,
 *   "tp2": 47500.0,
 *   "stop_loss": 44000.0,
 *   "market_regime": "TRENDING",
 *   "risk_score": 15.5,
 *   "sharpe_ratio": 1.8,
 *   "win_rate": 65.2,
 *   "monte_carlo_p5": -2.5,
 *   "generated_by": "external_source"
 * }
 */
export async function POST(request: NextRequest) {
  console.log('[NotificationPublish] Publishing event to Pub/Sub');

  // Verificar API key para evitar publicación no autorizada
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.NOTIFICATIONS_PUBLISH_API_KEY;
  
  if (validApiKey && apiKey !== validApiKey) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    );
  }

  if (!pubsubClient.isConfigured()) {
    return NextResponse.json(
      { 
        error: 'Pub/Sub not configured',
        message: 'Configure GCP_PROJECT_ID and PUBSUB_TOPIC environment variables'
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { source = 'external' } = body;

    // El payload puede venir directamente o en una propiedad 'payload'
    let signalPayload: SignalEventPayload;

    if (body.payload) {
      // Formato envuelto: { payload: {...}, source: "..." }
      signalPayload = body.payload as SignalEventPayload;
    } else {
      // Formato directo: {...}
      signalPayload = body as SignalEventPayload;
    }

    // Validar campos requeridos
    if (!signalPayload.symbol || !signalPayload.signal_direction || !signalPayload.strategy_id) {
      return NextResponse.json(
        { 
          error: 'Invalid payload',
          message: 'Required fields: symbol, signal_direction, strategy_id',
          example: {
            symbol: 'BTC/USDT',
            timeframe: '4h',
            signal_type: 'entry',
            signal_direction: 'BUY',
            strategy_id: 'moderate',
            entry: 45000,
            stop_loss: 44000,
            tp1: 46000,
            generated_by: 'external_source'
          }
        },
        { status: 400 }
      );
    }

    // Crear evento
    const event: SignalEvent = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventType: 'signal_generated',
      timestamp: signalPayload.timestamp || new Date().toISOString(),
      source: source as SignalEvent['source'],
      correlationId: signalPayload.generated_by,
      payload: signalPayload,
    };

    console.log(`[NotificationPublish] Publishing event: ${event.eventId}`);
    console.log(`[NotificationPublish] Signal: ${signalPayload.signal_direction} ${signalPayload.symbol}`);

    // Publicar en Pub/Sub
    const messageId = await pubsubClient.publishSignalEvent(event);

    console.log(`[NotificationPublish] Event published with ID: ${messageId}`);

    return NextResponse.json({
      success: true,
      eventId: event.eventId,
      messageId,
      topic: pubsubClient.getTopicName(),
      timestamp: event.timestamp,
      signal: {
        symbol: signalPayload.symbol,
        direction: signalPayload.signal_direction,
        strategy: signalPayload.strategy_id,
        entry: signalPayload.entry,
        stop_loss: signalPayload.stop_loss
      }
    });

  } catch (error) {
    console.error('[NotificationPublish] Error publishing event:', error);
    return NextResponse.json(
      { 
        error: 'Failed to publish event',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * Endpoint GET para información del publicador
 */
export async function GET() {
  return NextResponse.json({
    service: 'notification-publisher',
    configured: pubsubClient.isConfigured(),
    topic: pubsubClient.getTopicName(),
    subscription: pubsubClient.getSubscriptionName(),
    format: 'direct_signal',
    example: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '<your-api-key>'
      },
      body: {
        symbol: 'BTC/USDT',
        timeframe: '4h',
        timestamp: '2026-02-26T15:15:00Z',
        signal_type: 'entry',
        signal_direction: 'BUY',
        strategy_id: 'moderate',
        reason: 'External signal from TradingView',
        entry: 45000.0,
        tp1: 46000.0,
        tp2: 47500.0,
        stop_loss: 44000.0,
        market_regime: 'TRENDING',
        risk_score: 15.5,
        sharpe_ratio: 1.8,
        win_rate: 65.2,
        generated_by: 'external_source'
      }
    }
  });
}
