import { NextRequest, NextResponse } from 'next/server';
import { pubsubClient, SignalEvent, SignalEventPayload } from '@/lib/pubsub/client';
import { eventNotificationService } from '@/lib/services/EventNotificationService';

/**
 * Endpoint para recibir mensajes de Google Cloud Pub/Sub via push subscription
 * 
 * El evento llega en este formato:
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
  console.log('[PubSubWebhook] Received request');

  try {
    // Verificar que viene de Google Cloud Pub/Sub
    const signature = request.headers.get('x-goog-signature') || '';
    const messageId = request.headers.get('x-goog-message-id') || '';

    console.log(`[PubSubWebhook] Message ID: ${messageId}`);

    // Obtener el body del mensaje
    const body = await request.json();

    // Pub/Sub envía los mensajes en formato base64 en el campo "message.data"
    let rawPayload: any;

    if (body.message?.data) {
      // Decodificar el mensaje de Pub/Sub
      const decodedData = Buffer.from(body.message.data, 'base64').toString('utf-8');
      rawPayload = JSON.parse(decodedData);
    } else if (body.data) {
      // Formato directo (para testing)
      rawPayload = typeof body.data === 'string' ? JSON.parse(body.data) : body.data;
    } else {
      // El payload puede venir directamente en el body
      rawPayload = body;
    }

    console.log(`[PubSubWebhook] Raw payload:`, JSON.stringify(rawPayload, null, 2));

    // Validar que es un evento de señal válido
    // El evento puede venir directamente o envuelto en SignalEvent
    let signalPayload: SignalEventPayload;
    let eventSource: string = 'external';

    if (rawPayload.payload) {
      // Formato envuelto: SignalEvent
      signalPayload = rawPayload.payload as SignalEventPayload;
      eventSource = rawPayload.source || 'external';
    } else {
      // Formato directo: SignalEventPayload
      signalPayload = rawPayload as SignalEventPayload;
    }

    // Validar campos requeridos
    if (!signalPayload.symbol || !signalPayload.signal_direction || !signalPayload.strategy_id) {
      console.warn('[PubSubWebhook] Invalid signal format:', signalPayload);
      return NextResponse.json(
        { error: 'Invalid signal format: missing required fields' },
        { status: 400 }
      );
    }

    // Crear el evento normalizado
    const event: SignalEvent = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventType: 'signal_generated',
      timestamp: signalPayload.timestamp || new Date().toISOString(),
      source: eventSource as SignalEvent['source'],
      correlationId: signalPayload.generated_by,
      payload: signalPayload,
    };

    console.log(`[PubSubWebhook] Processing event: ${event.eventId} (${event.eventType})`);
    console.log(`[PubSubWebhook] Signal: ${signalPayload.signal_direction} ${signalPayload.symbol} @ $${signalPayload.entry}`);

    // Procesar el evento de señal
    await eventNotificationService.processEvent(event);

    // Responder a Pub/Sub para confirmar recepción
    return NextResponse.json(
      { 
        success: true, 
        eventId: event.eventId,
        signal: {
          symbol: signalPayload.symbol,
          direction: signalPayload.signal_direction,
          strategy: signalPayload.strategy_id
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[PubSubWebhook] Error processing message:', error);
    
    // Even on error, return 200 to Pub/Sub to prevent redelivery
    // Pub/Sub will retry based on the ack deadline
    return NextResponse.json(
      { 
        error: 'Processing failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 200 }
    );
  }
}

/**
 * Endpoint GET para verificar salud del servicio
 */
export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get('action');

  if (action === 'pull') {
    // Pull manual de mensajes (para testing o cron)
    return handleManualPull();
  }

  if (action === 'stats') {
    // Obtener estadísticas de la suscripción
    return handleGetStats();
  }

  // Estado del servicio
  return NextResponse.json({
    service: 'notification-pubsub',
    status: 'running',
    configured: pubsubClient.isConfigured(),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Manejar pull manual de mensajes
 */
async function handleManualPull() {
  console.log('[PubSubWebhook] Manual pull requested');

  if (!pubsubClient.isConfigured()) {
    return NextResponse.json(
      { error: 'Pub/Sub not configured' },
      { status: 503 }
    );
  }

  try {
    const maxMessages = 10;
    const result = await pubsubClient.processMessages(
      async (event) => {
        console.log(`[PubSubWebhook] Processing event: ${event.eventId}`);
        await eventNotificationService.processEvent(event);
      },
      maxMessages
    );

    return NextResponse.json({
      success: true,
      processed: result.processed,
      failed: result.failed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[PubSubWebhook] Error pulling messages:', error);
    return NextResponse.json(
      { 
        error: 'Failed to pull messages',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * Manejar solicitud de estadísticas
 */
async function handleGetStats() {
  if (!pubsubClient.isConfigured()) {
    return NextResponse.json(
      { error: 'Pub/Sub not configured' },
      { status: 503 }
    );
  }

  try {
    const stats = await pubsubClient.getSubscriptionStats();
    return NextResponse.json({
      success: true,
      subscription: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[PubSubWebhook] Error getting stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get stats',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
