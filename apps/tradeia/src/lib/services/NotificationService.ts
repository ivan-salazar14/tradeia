import { supabase } from '@/lib/supabase';

interface SignalData {
  signal_id: string;
  symbol: string;
  direction: string;
  strategy_id: string;
  timestamp: string;
}

interface UserPreferences {
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
  data: any;
}

export class NotificationService {
  private static instance: NotificationService;
  private notificationApiKey: string;
  private notificationApiUrl: string;

  private constructor() {
    this.notificationApiKey = process.env.NOTIFICATION_API_KEY || '';
    this.notificationApiUrl = process.env.NOTIFICATION_API_URL || 'https://api.notificationapi.com';
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Process a new signal notification
   */
  async processNewSignal(signalData: SignalData): Promise<void> {
    try {
      console.log('[NotificationService] Processing new signal:', signalData);

      // Get all users who should receive notifications for this signal
      const usersToNotify = await this.getUsersForSignal(signalData);

      console.log(`[NotificationService] Found ${usersToNotify.length} users to notify`);

      // Send notifications to each user
      const notificationPromises = usersToNotify.map(user =>
        this.sendNotificationToUser(user.userId, user.preferences, signalData)
      );

      await Promise.allSettled(notificationPromises);

    } catch (error) {
      console.error('[NotificationService] Error processing new signal:', error);
    }
  }

  /**
   * Get users who should receive notifications for a signal
   */
  private async getUsersForSignal(signalData: SignalData): Promise<Array<{userId: string, preferences: UserPreferences}>> {
    try {
      if (!supabase) {
        console.error('[NotificationService] Supabase client not initialized');
        return [];
      }

      // Get all users with notification preferences
      const { data: users, error } = await supabase
        .from('user_notification_preferences')
        .select('user_id, email_notifications, push_notifications, strategies, symbols, timeframes');

      if (error) {
        console.error('[NotificationService] Error fetching user preferences:', error);
        return [];
      }

      if (!users) return [];

      // Filter users based on their preferences
      return users
        .filter(user => this.shouldNotifyUser(user, signalData))
        .map(user => ({
          userId: user.user_id,
          preferences: {
            email_notifications: user.email_notifications,
            push_notifications: user.push_notifications,
            strategies: user.strategies || [],
            symbols: user.symbols || [],
            timeframes: user.timeframes || []
          }
        }));

    } catch (error) {
      console.error('[NotificationService] Error getting users for signal:', error);
      return [];
    }
  }

  /**
   * Check if a user should receive notifications for a signal
   */
  private shouldNotifyUser(user: any, signalData: SignalData): boolean {
    // Check if user has notifications enabled
    if (!user.email_notifications && !user.push_notifications) {
      return false;
    }

    // Check strategy filter
    if (user.strategies && user.strategies.length > 0) {
      if (!user.strategies.includes(signalData.strategy_id)) {
        return false;
      }
    }

    // Check symbol filter
    if (user.symbols && user.symbols.length > 0) {
      if (!user.symbols.includes(signalData.symbol)) {
        return false;
      }
    }

    // For now, skip timeframe filtering as we don't have timeframe in signal data
    // This could be added later when signals include timeframe info

    return true;
  }

  /**
   * Send notification to a specific user
   */
  private async sendNotificationToUser(
    userId: string,
    preferences: UserPreferences,
    signalData: SignalData
  ): Promise<void> {
    try {
      // Create notification payload
      const payload: NotificationPayload = {
        userId,
        signalId: signalData.signal_id,
        type: 'email', // Default to email, could be expanded
        title: `Nueva señal: ${signalData.direction} ${signalData.symbol}`,
        message: `Se ha generado una señal ${signalData.direction} para ${signalData.symbol} usando la estrategia ${signalData.strategy_id}`,
        data: {
          signalId: signalData.signal_id,
          symbol: signalData.symbol,
          direction: signalData.direction,
          strategyId: signalData.strategy_id,
          timestamp: signalData.timestamp
        }
      };

      // Send email notification if enabled
      if (preferences.email_notifications) {
        await this.sendEmailNotification(payload);
      }

      // Send push notification if enabled
      if (preferences.push_notifications) {
        await this.sendPushNotification(payload);
      }

    } catch (error) {
      console.error(`[NotificationService] Error sending notification to user ${userId}:`, error);

      // Record failed notification
      await this.recordNotificationHistory({
        user_id: userId,
        signal_id: signalData.signal_id,
        notification_type: 'email',
        status: 'failed',
        provider_response: { error: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * Send email notification via NotificationAPI
   */
  private async sendEmailNotification(payload: NotificationPayload): Promise<void> {
    try {
      const response = await fetch(`${this.notificationApiUrl}/sender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.notificationApiKey}`
        },
        body: JSON.stringify({
          notificationId: 'new_signal',
          userId: payload.userId,
          email: true, // Send email
          data: {
            title: payload.title,
            message: payload.message,
            signalData: payload.data
          }
        })
      });

      if (!response.ok) {
        throw new Error(`NotificationAPI responded with ${response.status}`);
      }

      // Record successful notification
      await this.recordNotificationHistory({
        user_id: payload.userId,
        signal_id: payload.signalId,
        notification_type: 'email',
        status: 'sent',
        sent_at: new Date().toISOString()
      });

      console.log(`[NotificationService] Email notification sent to user ${payload.userId}`);

    } catch (error) {
      console.error('[NotificationService] Error sending email notification:', error);
      throw error;
    }
  }

  /**
   * Send push notification via NotificationAPI
   */
  private async sendPushNotification(payload: NotificationPayload): Promise<void> {
    try {
      const response = await fetch(`${this.notificationApiUrl}/sender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.notificationApiKey}`
        },
        body: JSON.stringify({
          notificationId: 'new_signal_push',
          userId: payload.userId,
          push: true, // Send push notification
          data: {
            title: payload.title,
            message: payload.message,
            signalData: payload.data
          }
        })
      });

      if (!response.ok) {
        throw new Error(`NotificationAPI responded with ${response.status}`);
      }

      // Record successful notification
      await this.recordNotificationHistory({
        user_id: payload.userId,
        signal_id: payload.signalId,
        notification_type: 'push',
        status: 'sent',
        sent_at: new Date().toISOString()
      });

      console.log(`[NotificationService] Push notification sent to user ${payload.userId}`);

    } catch (error) {
      console.error('[NotificationService] Error sending push notification:', error);
      throw error;
    }
  }

  /**
   * Record notification history for audit trail
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
      if (!supabase) {
        console.error('[NotificationService] Supabase client not initialized');
        return;
      }

      const { error } = await supabase
        .from('notifications_history')
        .insert([data]);

      if (error) {
        console.error('[NotificationService] Error recording notification history:', error);
      }
    } catch (error) {
      console.error('[NotificationService] Error recording notification history:', error);
    }
  }

  /**
   * Initialize user notification preferences (call during onboarding)
   */
  async initializeUserPreferences(userId: string): Promise<void> {
    try {
      if (!supabase) {
        console.error('[NotificationService] Supabase client not initialized');
        return;
      }

      const { error } = await supabase
        .from('user_notification_preferences')
        .insert([{
          user_id: userId,
          email_notifications: true,
          push_notifications: true,
          strategies: ['moderate', 'conservative'],
          symbols: ['BTC/USDT', 'ETH/USDT'],
          timeframes: ['1H', '4H', '1D']
        }]);

      if (error) {
        console.error('[NotificationService] Error initializing user preferences:', error);
      } else {
        console.log(`[NotificationService] Initialized notification preferences for user ${userId}`);
      }
    } catch (error) {
      console.error('[NotificationService] Error initializing user preferences:', error);
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();