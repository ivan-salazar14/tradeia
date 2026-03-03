import { PubSub, Message, Subscription } from '@google-cloud/pubsub';
import { Logger } from '@/lib/utils/error-handler';

/**
 * Interfaz para mensajes de Pub/Sub
 */
export interface PubSubMessage {
  data: string;
  attributes: Record<string, string>;
  messageId: string;
  publishTime: string;
}

/**
 * Formato del evento de señal que llega desde Pub/Sub
 * Este es el formato exacto que se recibe del external source
 */
export interface SignalEventPayload {
  symbol: string;
  timeframe: string;
  timestamp: string;
  signal_type: 'entry' | 'exit' | 'update';
  signal_direction: 'BUY' | 'SELL';
  strategy_id: string;
  reason: string;
  entry: number;
  tp1?: number;
  tp2?: number;
  stop_loss: number;
  market_regime?: string;
  risk_score?: number;
  sharpe_ratio?: number;
  win_rate?: number;
  monte_carlo_p5?: number;
  generated_by: string;
}

/**
 * Interfaz para eventos de señal normalizados
 */
export interface SignalEvent {
  eventId: string;
  eventType: 'signal_generated' | 'signal_updated' | 'signal_cancelled';
  timestamp: string;
  source: 'api' | 'webhook' | 'scheduler' | 'external';
  correlationId?: string;
  payload: SignalEventPayload;
}

/**
 * Cliente de Google Cloud Pub/Sub para TradeIA
 */
export class PubSubClient {
  private static instance: PubSubClient;
  private pubsub: PubSub;
  private subscription: Subscription | null = null;
  private projectId: string;
  private subscriptionName: string;
  private topicName: string;

  private constructor() {
    this.projectId = process.env.GCP_PROJECT_ID || '';
    this.subscriptionName = process.env.PUBSUB_SUBSCRIPTION || 'tradeia-signals';
    this.topicName = process.env.PUBSUB_TOPIC || 'tradeia-signals';

    if (!this.projectId) {
      Logger.warn('[PubSubClient] GCP_PROJECT_ID not configured');
    }

    // Inicializar cliente de Pub/Sub
    this.pubsub = new PubSub({
      projectId: this.projectId,
      keyFilename: process.env.GCP_KEY_FILE,
    });

    Logger.info(`[PubSubClient] Initialized with project: ${this.projectId}, topic: ${this.topicName}`);
  }

  public static getInstance(): PubSubClient {
    if (!PubSubClient.instance) {
      PubSubClient.instance = new PubSubClient();
    }
    return PubSubClient.instance;
  }

  /**
   * Verificar si Pub/Sub está configurado
   */
  isConfigured(): boolean {
    return !!this.projectId && !!this.topicName;
  }

  /**
   * Obtener el nombre del topic
   */
  getTopicName(): string {
    return this.topicName;
  }

  /**
   * Obtener el nombre de la subscription
   */
  getSubscriptionName(): string {
    return this.subscriptionName;
  }

  /**
   * Publicar un mensaje en el topic
   */
  async publishMessage(data: object, attributes?: Record<string, string>): Promise<string> {
    try {
      const dataBuffer = Buffer.from(JSON.stringify(data));
      
      const messageId = await this.pubsub
        .topic(this.topicName)
        .publishMessage({
          data: dataBuffer,
          attributes: attributes || {},
        });

      Logger.info(`[PubSubClient] Published message: ${messageId}`);
      return messageId;
    } catch (error) {
      Logger.error('[PubSubClient] Error publishing message:', error);
      throw error;
    }
  }

  /**
   * Publicar un evento de señal
   */
  async publishSignalEvent(event: SignalEvent): Promise<string> {
    return this.publishMessage(event, {
      eventType: event.eventType,
      source: event.source,
    });
  }

  /**
   * Suscribirse al topic (para pull manual)
   */
  async subscribe(): Promise<Subscription> {
    if (this.subscription) {
      return this.subscription;
    }

    try {
      // Intentar crear o obtener la subscription
      try {
        this.subscription = await this.pubsub.subscribe(this.subscriptionName);
      } catch (subError: any) {
        // Si no existe, crearla
        if (subError.code === 5 || subError.message?.includes('NOT_FOUND')) {
          const topic = this.pubsub.topic(this.topicName);
          this.subscription = await topic.createSubscription(this.subscriptionName);
          Logger.info(`[PubSubClient] Created subscription: ${this.subscriptionName}`);
        } else {
          throw subError;
        }
      }

      Logger.info(`[PubSubClient] Subscribed to: ${this.subscriptionName}`);
      return this.subscription;
    } catch (error) {
      Logger.error('[PubSubClient] Error subscribing:', error);
      throw error;
    }
  }

  /**
   * Pull de mensajes (para procesamiento manual)
   */
  async pullMessages(maxMessages: number = 10): Promise<PubSubMessage[]> {
    const subscription = await this.subscribe();
    
    const messages: PubSubMessage[] = [];
    
    try {
      const receivedMessages = await subscription.pull({
        maxMessages,
        returnImmediately: true,
      });

      for (const msg of receivedMessages) {
        messages.push({
          data: msg.data.toString(),
          attributes: msg.attributes,
          messageId: msg.id,
          publishTime: msg.publishTime,
        });
      }

      // Acknowledgment de los mensajes
      if (messages.length > 0) {
        const ackIds = receivedMessages.map((msg: Message) => msg.ackId);
        await subscription.ack(ackIds);
        Logger.info(`[PubSubClient] Acknowledged ${ackIds.length} messages`);
      }

      return messages;
    } catch (error) {
      Logger.error('[PubSubClient] Error pulling messages:', error);
      throw error;
    }
  }

  /**
   * Procesar mensajes con un handler
   */
  async processMessages(
    handler: (event: SignalEvent) => Promise<void>,
    maxMessages: number = 10
  ): Promise<{ processed: number; failed: number }> {
    const messages = await this.pullMessages(maxMessages);
    
    let processed = 0;
    let failed = 0;

    for (const msg of messages) {
      try {
        const event = JSON.parse(msg.data) as SignalEvent;
        await handler(event);
        processed++;
      } catch (error) {
        Logger.error(`[PubSubClient] Error processing message ${msg.messageId}:`, error);
        failed++;
      }
    }

    return { processed, failed };
  }

  /**
   * Obtener estadísticas de la subscription
   */
  async getSubscriptionStats(): Promise<{
    name: string;
    topic: string;
    metric: any;
  } | null> {
    try {
      const subscription = await this.subscribe();
      const [metric] = await subscription.getMetadata();
      
      return {
        name: subscription.name,
        topic: metric?.topic || this.topicName,
        metric,
      };
    } catch (error) {
      Logger.error('[PubSubClient] Error getting subscription stats:', error);
      return null;
    }
  }

  /**
   * Cerrar conexión
   */
  async close(): Promise<void> {
    if (this.subscription) {
      await this.subscription.close();
      this.subscription = null;
    }
    Logger.info('[PubSubClient] Connection closed');
  }
}

// Singleton
export const pubsubClient = PubSubClient.getInstance();
