"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface Notification {
  id: string;
  signal_id: string;
  notification_type: string;
  status: string;
  sent_at: string;
  created_at: string;
  signals: {
    symbol: string;
    direction: string;
    strategy_id: string;
    entry: number;
    tp1: number;
    stop_loss: number;
  } | null;
}

interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  strategies: string[];
  symbols: string[];
  timeframes: string[];
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  current_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('history');

  // Available options for preferences
  const availableStrategies = ['moderate', 'conservative', 'aggressive', 'scalping', 'swing'];
  const availableSymbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ADA/USDT', 'DOT/USDT'];
  const availableTimeframes = ['1H', '4H', '1D', '1W'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadNotifications(),
        loadPreferences()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async (page = 1) => {
    try {
      const offset = (page - 1) * 20;
      const response = await fetch(`/api/user/notifications?limit=20&offset=${offset}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/user/notification-preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    if (!preferences) return;

    setSaving(true);
    try {
      const response = await fetch('/api/user/notification-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        alert('Preferencias guardadas exitosamente');
      } else {
        alert('Error al guardar las preferencias');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Error al guardar las preferencias');
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: value });
  };

  const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notificaciones</h1>
        <p className="text-gray-600">Gestiona tus preferencias de notificación y revisa el historial de alertas</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Historial
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'preferences'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ⚙️ Preferencias
            </button>
          </nav>
        </div>
      </div>

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Historial de Notificaciones</h2>
            <p className="text-gray-600">Revisa todas las notificaciones enviadas para tus señales</p>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🔔</div>
              <p>No hay notificaciones para mostrar</p>
              <p className="text-sm">Las notificaciones aparecerán aquí cuando se generen nuevas señales</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(notification.status)}`}>
                          {notification.status === 'sent' ? 'Enviada' :
                           notification.status === 'failed' ? 'Fallida' : 'Pendiente'}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                          {notification.notification_type === 'email' ? 'Email' : 'Push'}
                        </span>
                      </div>

                      {notification.signals && (
                        <div className="mb-2">
                          <p className="font-medium">
                            Señal {notification.signals.direction} - {notification.signals.symbol}
                          </p>
                          <p className="text-sm text-gray-600">
                            Estrategia: {notification.signals.strategy_id} |
                            Entrada: ${notification.signals.entry} |
                            TP: ${notification.signals.tp1} |
                            SL: ${notification.signals.stop_loss}
                          </p>
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        {notification.sent_at ?
                          `Enviada: ${formatDate(notification.sent_at)}` :
                          `Creada: ${formatDate(notification.created_at)}`
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {pagination && pagination.total_pages > 1 && (
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => loadNotifications(pagination.current_page - 1)}
                    disabled={!pagination.has_prev}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-600">
                    Página {pagination.current_page} de {pagination.total_pages}
                  </span>
                  <button
                    onClick={() => loadNotifications(pagination.current_page + 1)}
                    disabled={!pagination.has_next}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Preferencias de Notificación</h2>
            <p className="text-gray-600">Configura cómo y cuándo quieres recibir notificaciones de señales</p>
          </div>

          {preferences && (
            <div className="space-y-6">
              {/* Notification Types */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tipos de Notificación</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <span>Notificaciones por Email</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.email_notifications}
                      onChange={(e) => updatePreference('email_notifications', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>📱</span>
                      <span>Notificaciones Push</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.push_notifications}
                      onChange={(e) => updatePreference('push_notifications', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Strategy Filters */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Estrategias</h3>
                <p className="text-sm text-gray-600">Selecciona las estrategias para las que quieres recibir notificaciones</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableStrategies.map((strategy) => (
                    <div key={strategy} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`strategy-${strategy}`}
                        checked={preferences.strategies.includes(strategy)}
                        onChange={() => updatePreference('strategies', toggleArrayItem(preferences.strategies, strategy))}
                        className="rounded"
                      />
                      <label htmlFor={`strategy-${strategy}`} className="text-sm capitalize">
                        {strategy}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Symbol Filters */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Símbolos</h3>
                <p className="text-sm text-gray-600">Selecciona los pares de trading para los que quieres recibir notificaciones</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSymbols.map((symbol) => (
                    <div key={symbol} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`symbol-${symbol}`}
                        checked={preferences.symbols.includes(symbol)}
                        onChange={() => updatePreference('symbols', toggleArrayItem(preferences.symbols, symbol))}
                        className="rounded"
                      />
                      <label htmlFor={`symbol-${symbol}`} className="text-sm">
                        {symbol}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeframe Filters */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Timeframes</h3>
                <p className="text-sm text-gray-600">Selecciona los timeframes para los que quieres recibir notificaciones</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableTimeframes.map((timeframe) => (
                    <div key={timeframe} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`timeframe-${timeframe}`}
                        checked={preferences.timeframes.includes(timeframe)}
                        onChange={() => updatePreference('timeframes', toggleArrayItem(preferences.timeframes, timeframe))}
                        className="rounded"
                      />
                      <label htmlFor={`timeframe-${timeframe}`} className="text-sm">
                        {timeframe}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t">
                <button
                  onClick={savePreferences}
                  disabled={saving}
                  className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar Preferencias'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}