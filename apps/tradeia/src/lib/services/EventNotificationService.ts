import { supabaseAdmin } from '@/lib/supabase/admin';
import { SignalEvent, SignalEventPayload } from '@/lib/pubsub/client';

interface UserPreferences {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  strategies: string[];
  symbols: string[];
  timeframes: string[];
}

interface NotificationPayload {
  userId: string;
  signalId: string;
  type: 'email' | 'push';
  title: string;
  message: string;
  data: SignalEventPayload;
}

interface ProcessedNotification {
  userId: string;
  preferences: UserPreferences;
  status: 'sent' | 'failed' | 'skipped';
  error?: string;
}

/**
 * Servicio de Notificaciones Agnóstico
 * 
 * Este servicio procesa eventos de señales desde cualquier fuente (cola, webhook, API)
 * sin depender de PostgreSQL para las señales.
 * 
 * Formato de evento esperado:
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
export class EventNotificationService {
  private static instance: EventNotificationService;
  private notificationApiKey: string;
  private notificationApiUrl: string;

  private constructor() {
    this.notificationApiKey = process.env.NOTIFICATION_API_KEY || '';
    this.notificationApiUrl = process.env.NOTIFICATION_API_URL || 'https://api.notificationapi.com';

    console.log('[EventNotificationService] Initialized');
  }

  public static getInstance(): EventNotificationService {
    if (!EventNotificationService.instance) {
      EventNotificationService.instance = new EventNotificationService();
    }
    return EventNotificationService.instance;
  }

  /**
   * Procesar un evento de señal desde la cola
   * Este método es agnóstico - no sabe de dónde vino el evento
   */
  async processSignalEvent(event: SignalEvent): Promise<ProcessedNotification[]> {
    console.log(`[EventNotificationService] Processing event: ${event.eventId} (${event.eventType})`);
    console.log(`[EventNotificationService] Signal data:`, JSON.stringify(event.payload, null, 2));

    const results: ProcessedNotification[] = [];

    switch (event.eventType) {
      case 'signal_generated':
        const notifications = await this.handleSignalGenerated(event.payload, event);
        results.push(...notifications);
        break;

      case 'signal_updated':
        await this.handleSignalUpdated(event.payload);
        break;

      case 'signal_cancelled':
        await this.handleSignalCancelled(event.payload);
        break;

      default:
        console.warn(`[EventNotificationService] Unknown event type: ${event.eventType}`);
    }

    return results;
  }

  /**
   * Manejar señal generada - enviar notificaciones a usuarios relevantes
   */
  private async handleSignalGenerated(
    payload: SignalEventPayload,
    event: SignalEvent
  ): Promise<ProcessedNotification[]> {
    // 1. Generar un ID de señal si no existe
    const signalId = `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 2. Obtener usuarios a notificar según sus preferencias
    const usersToNotify = await this.getUsersForSignal(payload);

    console.log(`[EventNotificationService] Found ${usersToNotify.length} users to notify`);

    const results: ProcessedNotification[] = [];

    // 3. Enviar notificaciones a cada usuario
    for (const user of usersToNotify) {
      try {
        await this.sendNotificationToUser(user, payload, signalId);
        results.push({
          userId: user.user_id,
          preferences: user,
          status: 'sent',
        });
      } catch (error) {
        console.error(`[EventNotificationService] Error notifying user ${user.user_id}:`, error);
        results.push({
          userId: user.user_id,
          preferences: user,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
        });

        // Registrar intento fallido
        await this.recordNotificationHistory({
          user_id: user.user_id,
          signal_id: signalId,
          notification_type: user.email_notifications ? 'email' : 'push',
          status: 'failed',
          provider_response: { error: error instanceof Error ? error.message : String(error) },
        });
      }
    }

    // 4. Registrar evento procesado
    await this.recordSignalEvent(event, signalId, results);

    return results;
  }

  /**
   * Manejar señal actualizada
   */
  private async handleSignalUpdated(payload: SignalEventPayload): Promise<void> {
    console.log(`[EventNotificationService] Signal updated: ${payload.symbol} ${payload.signal_direction}`);
    // Notificar a usuarios sobre actualización de señal
  }

  /**
   * Manejar señal cancelada
   */
  private async handleSignalCancelled(payload: SignalEventPayload): Promise<void> {
    console.log(`[EventNotificationService] Signal cancelled: ${payload.symbol}`);
    // Notificar a usuarios sobre cancelación
  }

  /**
   * Obtener usuarios que deben ser notificados según sus preferencias
   */
  private async getUsersForSignal(payload: SignalEventPayload): Promise<UserPreferences[]> {
    try {
      if (!supabaseAdmin) {
        console.error('[EventNotificationService] Supabase client not initialized');
        return [];
      }

      // Obtener todos los usuarios con preferencias de notificación
      const { data: users, error } = await (supabaseAdmin as any)
        .from('user_notification_preferences')
        .select('*');

      if (error) {
        console.error('[EventNotificationService] Error fetching user preferences:', error);
        return [];
      }

      if (!users) return [];

      // Filtrar usuarios según sus preferencias
      return (users as UserPreferences[])
        .filter(user => this.shouldNotifyUser(user, payload))
        .map(user => ({
          user_id: user.user_id,
          email_notifications: user.email_notifications,
          push_notifications: user.push_notifications,
          strategies: user.strategies || [],
          symbols: user.symbols || [],
          timeframes: user.timeframes || [],
        }));

    } catch (error) {
      console.error('[EventNotificationService] Error getting users for signal:', error);
      return [];
    }
  }

  /**
   * Verificar si un usuario debe ser notificado
   */
  private shouldNotifyUser(user: UserPreferences, payload: SignalEventPayload): boolean {
    // Verificar si el usuario tiene notificaciones habilitadas
    if (!user.email_notifications && !user.push_notifications) {
      return false;
    }

    // Verificar filtro de estrategia
    if (user.strategies && user.strategies.length > 0) {
      if (!user.strategies.includes(payload.strategy_id)) {
        return false;
      }
    }

    // Verificar filtro de símbolo
    if (user.symbols && user.symbols.length > 0) {
      if (!user.symbols.includes(payload.symbol)) {
        return false;
      }
    }

    // Verificar filtro de timeframe
    if (user.timeframes && user.timeframes.length > 0) {
      const tf = payload.timeframe.toUpperCase();
      if (!user.timeframes.includes(tf)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Enviar notificación a un usuario específico
   */
  private async sendNotificationToUser(
    user: UserPreferences,
    payload: SignalEventPayload,
    signalId: string
  ): Promise<void> {
    // Construir mensaje de notificación
    const directionText = payload.signal_direction === 'BUY' ? '📈 COMPRAR' : '📉 VENDER';
    const title = `${directionText} ${payload.symbol}`;
    
    let message = `Señal ${payload.signal_direction} en ${payload.symbol}\n`;
    message += `📊 Estrategia: ${payload.strategy_id}\n`;
    message += `🎯 Entrada: $${payload.entry}\n`;
    message += `🛡️ Stop Loss: $${payload.stop_loss}\n`;
    
    if (payload.tp1) message += `📈 TP1: $${payload.tp1}\n`;
    if (payload.tp2) message += `📈 TP2: $${payload.tp2}\n`;
    
    if (payload.reason) message += `\n📝 Razón: ${payload.reason}`;

    // Enviar email si está habilitado
    if (user.email_notifications) {
      await this.sendEmailNotification({
        userId: user.user_id,
        signalId,
        type: 'email',
        title,
        message,
        data: payload,
      });
    }

    // Enviar push si está habilitado
    if (user.push_notifications) {
      await this.sendPushNotification({
        userId: user.user_id,
        signalId,
        type: 'push',
        title,
        message,
        data: payload,
      });
    }
  }

  /**
   * Enviar notificación por email
   */
  private async sendEmailNotification(payload: NotificationPayload): Promise<void> {
    if (!this.notificationApiKey) {
      console.warn('[EventNotificationService] NotificationAPI key not configured, skipping email');
      return;
    }

    try {
      const response = await fetch(`${this.notificationApiUrl}/sender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.notificationApiKey}`,
        },
        body: JSON.stringify({
          notificationId: 'new_signal',
          userId: payload.userId,
          email: true,
          data: {
            title: payload.title,
            message: payload.message,
            signalData: {
              symbol: payload.data.symbol,
              direction: payload.data.signal_direction,
              strategy_id: payload.data.strategy_id,
              entry: payload.data.entry,
              stop_loss: payload.data.stop_loss,
              tp1: payload.data.tp1,
              tp2: payload.data.tp2,
              timeframe: payload.data.timeframe,
              reason: payload.data.reason,
              risk_score: payload.data.risk_score,
              win_rate: payload.data.win_rate,
            },
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`NotificationAPI error: ${response.status} - ${errorText}`);
      }

      // Registrar éxito
      await this.recordNotificationHistory({
        user_id: payload.userId,
        signal_id: payload.signalId,
        notification_type: 'email',
        status: 'sent',
        sent_at: new Date().toISOString(),
      });

      console.log(`[EventNotificationService] Email sent to user ${payload.userId}`);
    } catch (error) {
      console.error('[EventNotificationService] Error sending email:', error);
      throw error;
    }
  }

  /**
   * Enviar notificación push
   */
  private async sendPushNotification(payload: NotificationPayload): Promise<void> {
    if (!this.notificationApiKey) {
      console.warn('[EventNotificationService] NotificationAPI key not configured, skipping push');
      return;
    }

    try {
      const response = await fetch(`${this.notificationApiUrl}/sender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.notificationApiKey}`,
        },
        body: JSON.stringify({
          notificationId: 'new_signal_push',
          userId: payload.userId,
          push: true,
          data: {
            title: payload.title,
            message: payload.message,
            signalData: {
              symbol: payload.data.symbol,
              direction: payload.data.signal_direction,
              strategy_id: payload.data.strategy_id,
              entry: payload.data.entry,
              stop_loss: payload.data.stop_loss,
              tp1: payload.data.tp1,
              tp2: payload.data.tp2,
            },
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`NotificationAPI error: ${response.status} - ${errorText}`);
      }

      // Registrar éxito
      await this.recordNotificationHistory({
        user_id: payload.userId,
        signal_id: payload.signalId,
        notification_type: 'push',
        status: 'sent',
        sent_at: new Date().toISOString(),
      });

      console.log(`[EventNotificationService] Push sent to user ${payload.userId}`);
    } catch (error) {
      console.error('[EventNotificationService] Error sending push:', error);
      throw error;
    }
  }

  /**
   * Registrar historial de notificaciones
   */
  private async recordNotificationHistory(data: {
    user_id: string;
    signal_id: string;
    notification_type: 'email' | 'push';
    status: 'sent' | 'failed' | 'pending';
    provider_response?: any;
    sent_at?: string;
  }): Promise<void> {
    try {
      if (!supabaseAdmin) return;

      await (supabaseAdmin as any)
        .from('notifications_history')
        .insert([data]);
    } catch (error) {
      console.error('[EventNotificationService] Error recording notification history:', error);
    }
  }

  /**
   * Registrar evento de señal procesado
   */
  private async recordSignalEvent(
    event: SignalEvent,
    signalId: string,
    results: ProcessedNotification[]
  ): Promise<void> {
    try {
      if (!supabaseAdmin) return;

      await (supabaseAdmin as any)
        .from('signal_events_log')
        .insert([{
          event_id: event.eventId,
          event_type: event.eventType,
          source: event.source,
          correlation_id: event.correlationId,
          payload: {
            ...event.payload,
            signalId,
          },
          users_notified: results.filter(r => r.status === 'sent').length,
          notifications_failed: results.filter(r => r.status === 'failed').length,
          processed_at: new Date().toISOString(),
        }]);
    } catch (error) {
      console.error('[EventNotificationService] Error recording signal event:', error);
    }
  }

  /**
   * Procesador de eventos para el worker
   * Esta función se usa para procesar mensajes de la cola
   */
  async processEvent(event: SignalEvent): Promise<void> {
    await this.processSignalEvent(event);
  }
}

// Exportar instancia singleton
export const eventNotificationService = EventNotificationService.getInstance();
