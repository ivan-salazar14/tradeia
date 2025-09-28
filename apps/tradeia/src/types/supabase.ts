export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          id_uuid: string
          email: string
          created_at: string
          updated_at: string
          onboarding_complete: boolean
          experience_level: string | null
          trading_goals: string | null
        }
        Insert: {
          id?: string
          id_uuid?: string
          email: string
          created_at?: string
          updated_at?: string
          onboarding_complete?: boolean
          experience_level?: string | null
          trading_goals?: string | null
        }
        Update: {
          id?: string
          id_uuid?: string
          email?: string
          created_at?: string
          updated_at?: string
          onboarding_complete?: boolean
          experience_level?: string | null
          trading_goals?: string | null
        }
      }
      strategies: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          risk_level: string
          timeframe: string
          indicators: any
          stop_loss: number | null
          take_profit: number | null
          max_positions: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          risk_level: string
          timeframe: string
          indicators?: any
          stop_loss?: number | null
          take_profit?: number | null
          max_positions?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          risk_level?: string
          timeframe?: string
          indicators?: any
          stop_loss?: number | null
          take_profit?: number | null
          max_positions?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_strategies: {
        Row: {
          user_id: string
          strategy_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          strategy_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          strategy_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      signals: {
        Row: {
          id: string
          symbol: string
          timeframe: string
          timestamp: string
          execution_timestamp: string | null
          signal_age_hours: number | null
          signal_source: string
          type: string
          direction: string
          strategy_id: string | null
          entry: number | null
          tp1: number | null
          tp2: number | null
          stop_loss: number | null
          source: any
          position_size: number | null
          risk_amount: number | null
          reward_to_risk: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          symbol: string
          timeframe: string
          timestamp?: string
          execution_timestamp?: string | null
          signal_age_hours?: number | null
          signal_source?: string
          type: string
          direction: string
          strategy_id?: string | null
          entry?: number | null
          tp1?: number | null
          tp2?: number | null
          stop_loss?: number | null
          source?: any
          position_size?: number | null
          risk_amount?: number | null
          reward_to_risk?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          timeframe?: string
          timestamp?: string
          execution_timestamp?: string | null
          signal_age_hours?: number | null
          signal_source?: string
          type?: string
          direction?: string
          strategy_id?: string | null
          entry?: number | null
          tp1?: number | null
          tp2?: number | null
          stop_loss?: number | null
          source?: any
          position_size?: number | null
          risk_amount?: number | null
          reward_to_risk?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_notification_preferences: {
        Row: {
          user_id: string
          email_notifications: boolean
          push_notifications: boolean
          strategies: string[] | null
          symbols: string[] | null
          timeframes: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          email_notifications?: boolean
          push_notifications?: boolean
          strategies?: string[] | null
          symbols?: string[] | null
          timeframes?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          email_notifications?: boolean
          push_notifications?: boolean
          strategies?: string[] | null
          symbols?: string[] | null
          timeframes?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications_history: {
        Row: {
          id: string
          user_id: string
          signal_id: string | null
          notification_type: string
          status: string
          provider_response: any
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          signal_id?: string | null
          notification_type: string
          status?: string
          provider_response?: any
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          signal_id?: string | null
          notification_type?: string
          status?: string
          provider_response?: any
          sent_at?: string | null
          created_at?: string
        }
      }
    }
  }
}